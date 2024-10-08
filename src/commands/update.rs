use crate::executers::config::*;
use crate::executers::endpoint::*;
use crate::model::config::Service;
use anyhow::{Ok, Result};

pub fn run(alias: String) -> Result<()> {
    let mut config = read_config_file()?;

    let service = config.dependencies.get(&alias).unwrap();

    let service = create_endpoint_files(
        alias.clone(),
        Service {
            version: None,
            repository: service.repository.clone(),
            workspaces: service.workspaces.clone(),
            branch: service.branch.clone(),
            exclude_periods: service.exclude_periods.clone(),
            roots: service.roots.clone(),
        },
        config.environment_identifier.clone(),
        config.output.clone(),
    )?;

    config.push(alias, service);

    write_config_file(config)?;
    Ok(())
}
