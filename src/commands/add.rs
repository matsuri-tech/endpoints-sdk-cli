use crate::executers::config::*;
use crate::executers::endpoint::*;
use crate::executers::repository::*;
use crate::model::config::Service;
use anyhow::{Ok, Result};

pub fn run(
    repository_name: String,
    workspaces: Option<Vec<String>>,
    branch: Option<String>,
    exclude_periods: Option<Vec<String>>,
) -> Result<()> {
    let mut config = read_config_file()?;

    let alias = get_repository_alias(&repository_name)?;
    let repository_path = get_repository_path(&repository_name)?;

    let service = create_endpoint_files(
        alias.clone(),
        Service {
            version: None,
            repository: repository_path,
            workspaces,
            branch,
            exclude_periods,
            roots: None,
        },
        config.environment_identifier.clone(),
        config.output.clone(),
    )?;

    config.push(alias, service);

    write_config_file(config)?;
    Ok(())
}
