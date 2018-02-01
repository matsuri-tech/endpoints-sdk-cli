import {Command, flags, parse} from '@anycli/command'
import cli from 'cli-ux'

export default class Hello extends Command {
  static title = 'scaffolded command that says hello'

  // hide the command from help
  // can also set hidden on args and flags
  // static hidden = true

  // usage is set by default
  // add your own by setting this variable
  // can be a string or array
  // static usage = 'title of command'

  static description = `
Add a longer description here
...
...
`

  static examples = [
    `$ example-multi-ts hello
hello world from hello!
`,
    `$ example-multi-ts hello --name myname
hello myname from hello!
`,
    '$ example-multi-ts hello file outputs "hello world!" to file',
    '$ example-multi-ts hello --force',
    '$ example-multi-ts hello --help',
  ]

  // allow running this command by running `$ example-multi-ts foobar`
  // static aliases = ['foobar']

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      char: 'n',                    // shorter flag version
      description: 'name to print', // help description for flag
      hidden: false,                // hide from help
      required: false,              // make flag required (probably should use an arg instead of a required flag though)
      multiple: false,              // allow setting this flag multiple times
      // options: ['a', 'b'],       // only allow the value to be from a discrete set
      // parse: input => 'output',  // instead of the user input, return a differnt value
      // default: 'world',          // default value if flag not passed
    }),

    // flag with no value (-f, --force)
    force: flags.boolean({
      char: 'f',

      // by default boolean flags may also be reversed with `--no-` (in this case: `--no-force`)
      // the flag will be set to false if reversed
      // set this to false to disable this functionality
      // allowNo: false,
    }),
  }

  static args = [
    {
      name: 'file',                  // name of arg to show in help and reference with this.options.args[name]
      required: false,               // make the arg required with `required: true`
      description: 'file to output', // help description
      // hidden: true,               // hide this flag from help
      // parse: input => 'output',   // instead of the user input, return a differnt value
      // default: 'world',           // default value if no arg input
      // options: ['a', 'b'],        // only allow input to be from a discrete set
    },
  ]

  // this makes the parser not fail when it receives invalid arguments
  // set it to off if you need to accept variable arguments
  // static strict = false

  // runs the parser and stores the results in this.options
  // you should run this even if you have no flags/args so it properly errors out
  // (see strict above for variable argument commands)
  //
  // stores the parsed flags in options.flags[name]
  //
  // stores the parsed args in options.args[name] as an object
  // but also in options.argv as an array
  // you can get the raw args passed to the command with this.argv
  // or from this.options.argv which will remove any args that were actually flags
  options = parse(this.argv, Hello)

  // entry point of command
  async run() {
    const name = this.options.flags.name || 'world'
    cli.log(`hello ${name} from hello!`)

    // this.options.flags.force is a boolean
    // this.options.args.file and this.options.argv[0] is a string or undefined
  }
}
