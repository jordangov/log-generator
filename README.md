# Log Generator

This script generates log files for use in training environments. Run the `log-generator.js` file to see help info and to run a command.

```bash
$ ./log-generator.js
Usage: log-generator [options] [command]

Generate log files for use in training environments

Options:
  -V, --version              output the version number
  -c, --count <number>       Number of log entries to generate (default: 10)
  -d, --delay <number>       Maximum random delay (in ms) between entries (default: 300000)
  -e, --extension <string>   An extension to use with most resources in logs (i.e. "php" for admin.php)
  -f, --filename <string>    Output filename, can use {{date}} placeholder in filename (specify "null" to suppress)
                             (default: "generated_{{date}}.log")
  -r, --reuse <decimal>      The chance (0-1) that a reusable field value is reused (i.e. usernames, IP addresses, etc)
                             (default: 0.3)
  -s, --start <datetime>     Start date/time (ISO format) for entries (default: "2024-08-22T21:54:46.205Z")
  -w, --write                Write log entries to the terminal (default: false)
  -h, --help                 display help for command

Commands:
  templates <template-name>  Show a log template (lists all templates if none specified)
  fields                     Show a list of available log template fields
  app                        Generate application log entries
  help [command]             display help for command
```

## Examples

### Generate application logs saved to a file

The command below will generate 100 fake application log entries using a predefined template. The resources identified in the logs will use a `.php` extension where appropriate. The resulting logs will be saved to a file called `generated_2024-08-22.log`

```
$ ./log-generator.js app -c 100 -e php
writing 100 log entries to generated_2024-08-22.log
```

### Generate application logs printed to the console

The command below will generate 10 fake application log entries using a predefined template. The resulting logs will be printed to the console and no file will be written.

```
$ ./log-generator.js app -c 10 -w -f null
writing 100 log entries to generated_2024-08-22.log
```

