use crate::model::endpoint::*;
use anyhow::{Ok, Result};
use std::fs::File;
use std::io::Read;
use std::process::Command;
use uuid::Uuid;

pub fn get_repository_alias(repository_name: &str) -> Result<String> {
    let alias = repository_name.split('/').last().unwrap();
    Ok(alias.to_string())
}

pub fn get_repository_path(repository_name: &String) -> Result<String> {
    Ok(format!("https://github.com/{}", repository_name))
}

pub fn clone_repository(ssh_path: &String) -> Result<String> {
    let cache = format!("node_modules/.endpoints-tmp/{}", Uuid::new_v4());

    Command::new("git")
        .args(["clone", "--no-checkout", "--quiet", ssh_path, &cache])
        .spawn()
        .unwrap()
        .wait()?;

    Ok(cache)
}

pub fn get_head_commit_hash(repository_path: &String) -> Result<String> {
    let output = Command::new("git")
        .args(["rev-parse", "HEAD"])
        .current_dir(repository_path)
        .output()?;
    let commit_hash = String::from_utf8(output.stdout)?;
    Ok(commit_hash.trim().to_string())
}

pub fn detect_main_branch(repository_path: &String) -> Result<String> {
    let output = Command::new("git")
        .args(["rev-parse", "--abbrev-ref", "HEAD"])
        .current_dir(repository_path)
        .output()?;
    let main_branch = String::from_utf8(output.stdout)?;
    Ok(main_branch.trim().to_string())
}

pub fn get_repository_data(
    repository_path: &String,
    branch_name: &String,
    workspace: &Option<String>,
    commit_hash: &Option<String>,
) -> Result<EndpointSetting> {
    let endpoints_file = {
        match workspace {
            Some(w) => format!("./{}/.endpoints.json", w),
            None => "./.endpoints.json".to_owned(),
        }
    };

    let output = Command::new("git")
        .args(["checkout", branch_name, "--", &endpoints_file])
        .current_dir(repository_path)
        .output()?;

    if !output.status.success() {
        println!("{:?}", output);
        return Err(anyhow::anyhow!("Failed to checkout"));
    }

    match commit_hash {
        Some(hash) => {
            let output = Command::new("git")
                .args(["reset", "--hard", hash])
                .current_dir(repository_path)
                .output()?;

            if !output.status.success() {
                println!("{:?}", output);
                return Err(anyhow::anyhow!("Failed to git reset"));
            }
        }
        None => {}
    }

    let target_file = {
        match workspace {
            Some(w) => format!("./{}/{}/.endpoints.json", repository_path, w),
            None => format!("./{}/.endpoints.json", repository_path),
        }
    };

    let mut contents = String::new();
    let mut file = File::open(target_file)?;
    file.read_to_string(&mut contents)?;

    let setting: EndpointSetting = serde_json::from_str(&contents).unwrap();
    Ok(setting)
}
