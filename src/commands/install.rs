use crate::executers::config::*;
use crate::executers::endpoint::*;
use crate::model::config::Service;
use anyhow::{Ok, Result};

pub fn run() -> Result<()> {
    let config = read_config_file()?;

    for (alias, service) in config.dependencies.iter() {
        create_endpoint_files(
            alias.clone(),
            Service {
                version: service.version.clone(),
                repository: service.repository.clone(),
                workspaces: service.workspaces.clone(),
                branch: service.branch.clone(),
                exclude_periods: service.exclude_periods.clone(),
                roots: service.roots.clone(),
            },
            config.environment_identifier.clone(),
            config.output.clone(),
        )?;
    }

    Ok(())
}
