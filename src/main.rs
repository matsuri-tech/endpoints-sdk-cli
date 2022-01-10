#[macro_use]
extern crate maplit;

mod model;

use std::ffi::OsString;

use clap::{AppSettings, Parser, Subcommand};

#[derive(Parser)]
#[clap(name = "mes")]
#[clap(about = "generate endpoint files for typescript")]
struct Cli {
    #[clap(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    #[clap(setting(AppSettings::ArgRequiredElseHelp))]
    Add {
        repository: String,
    },

    Install {},

    Update {
        service: String,
    },

    #[clap(external_subcommand)]
    External(Vec<OsString>),
}

fn main() {
    let args = Cli::parse();
    match &args.command {
        Commands::Add { repository } => {
            println!("add {}", repository);
        }
        Commands::Install {} => {}
        Commands::Update { service } => {
            println!("update {}", service);
        }
        Commands::External(args) => {
            println!("Calling out to {:?} with {:?}", &args[0], &args[1..]);
        }
    }
}
