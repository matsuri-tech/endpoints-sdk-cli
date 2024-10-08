use crate::templates::endpoint::make_endpoint;
use crate::templates::root::make_root;
use crate::utils::to_camel_case::to_camel_case;
use crate::{executers::repository::*, model::config::Service};
use anyhow::{Ok, Result};
use std::{fs::File, io::Write, path::Path};

pub fn get_endpoint_filepath(
    repository_name: String,
    workspace: Option<String>,
    version: Option<String>,
    has_extension: bool,
) -> Result<String> {
    let mut base_name = repository_name;

    if let Some(workspace) = workspace {
        base_name.push('.');
        base_name.push_str(&workspace);
    }

    if let Some(version) = version {
        base_name.push('.');
        base_name.push_str(&version);
    }

    if has_extension {
        base_name.push_str(".ts");
    }

    Ok(base_name)
}

#[test]
fn test_get_endpoint_filepath() {
    let filepath = get_endpoint_filepath(
        "repository".to_string(),
        Some("workspace".to_string()),
        Some("version".to_string()),
        true,
    )
    .unwrap();

    assert_eq!(filepath, "repository.workspace.version.ts");
}

#[test]
fn test_get_endpoint_filepath_without_workspace() {
    let filepath = get_endpoint_filepath(
        "repository".to_string(),
        None,
        Some("version".to_string()),
        true,
    )
    .unwrap();

    assert_eq!(filepath, "repository.version.ts");
}

#[test]
fn test_get_endpoint_filepath_without_extension() {
    let filepath =
        get_endpoint_filepath("name".to_string(), None, Some("version".to_string()), false)
            .unwrap();
    assert_eq!(filepath, "name.version");
}

pub fn write_endpoint_file(output: String, filename: String, contents: String) -> Result<()> {
    if !Path::new(&output).exists() {
        std::fs::create_dir_all(&output)?;
    }
    let file_path = Path::new(&output).join(filename);

    let mut file = File::create(file_path)?;
    file.write_all(contents.as_bytes())?;
    Ok(())
}

pub fn create_endpoint_files(
    repository_alias: String,
    service: Service,
    environment_identifier: String,
    output: String,
) -> Result<Service> {
    let cloned_repository_path = clone_repository(&service.repository)?;
    let commit_hash = match service.version.clone() {
        Some(version) => version,
        None => get_head_commit_hash(&cloned_repository_path)?,
    };

    let branch_name = match service.branch {
        Some(branch) => branch,
        None => detect_main_branch(&cloned_repository_path)?,
    };

    // workspaceが複数のケースに対応していない
    let workspace = service.workspaces.as_ref().and_then(|w| w.first().cloned());

    let repository_data = get_repository_data(
        &cloned_repository_path,
        &branch_name,
        &workspace,
        &service.version,
    )?;

    let mut index_imports: Vec<String> = Vec::new();
    let mut index_exports_names: Vec<String> = Vec::new();

    for (version, period) in repository_data {
        if service
            .exclude_periods
            .as_ref()
            .map_or(false, |excludes| excludes.contains(&version))
        {
            continue;
        }

        if period.env.as_ref().map_or(true, |env| env.is_empty())
            && period.api.as_ref().map_or(true, |api| api.is_empty())
        {
            continue;
        }

        let mut names: Vec<String> = Vec::new();
        let mut fns: Vec<String> = Vec::new();

        let root = make_root(
            environment_identifier.clone(),
            period.env.unwrap_or_default(),
            service.roots.clone(),
        );
        fns.push(root);

        for (_name, _endpoint) in period.api.unwrap_or_default() {
            let name = to_camel_case(&_name.to_string());
            names.push(name.clone());
            fns.push(make_endpoint(name.clone(), _endpoint));
        }
        let exports = format!(
            "export const {}_{} = {{{}}};",
            to_camel_case(&repository_alias),
            to_camel_case(&version.clone()),
            names.join(",")
        );

        let filepath = get_endpoint_filepath(
            repository_alias.clone(),
            workspace.clone(),
            Some(version.clone()),
            true,
        )?;

        index_imports.push(format!(
            "import * as {} from './{}';",
            to_camel_case(&version.clone()),
            get_endpoint_filepath(
                repository_alias.clone(),
                workspace.clone(),
                Some(version.clone()),
                true,
            )?,
        ));
        index_exports_names.push(to_camel_case(&version.clone()));

        write_endpoint_file(
            output.clone(),
            filepath,
            [fns.join("\n"), exports].join("\n"),
        )?;
    }

    index_imports.sort();
    index_exports_names.sort();

    write_endpoint_file(
        output.clone(),
        get_endpoint_filepath(repository_alias.clone(), None, None, true)?,
        [
            index_imports.join("\n"),
            format!(
                "export const {} = {{{}}};",
                to_camel_case(&repository_alias),
                index_exports_names.join(",")
            ),
        ]
        .join("\n"),
    )?;

    Ok(Service {
        version: Some(commit_hash),
        repository: service.repository,
        workspaces: workspace.map(|workspace| vec![workspace]),
        branch: Some(branch_name.clone()),
        exclude_periods: service.exclude_periods,
        roots: service.roots,
    })
}
