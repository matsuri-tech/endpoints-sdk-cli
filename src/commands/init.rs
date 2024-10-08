use crate::executers::config::*;
use anyhow::{Ok, Result};

pub fn run() -> Result<()> {
    create_config_file()?;
    Ok(())
}
