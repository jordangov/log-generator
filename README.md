# Log Generator

This script generates log files for use in training environments. Run `./log-generator.js` file to see help info and to run a command.

## Examples

### Generate application logs saved to a file

The command below will generate 100 fake application log entries using a predefined template. The resources identified in the logs will use a `.php` extension where appropriate. The resulting logs will be saved to a file called `generated_2024-08-22.log`

```
$ ./log-generator.js generate -t app -c 100 -e php -f generated_{{date}}.log
writing 100 log entries to generated_2024-08-22.log
```

### Generate application logs printed to the console

The command below will generate 10 fake application log entries using a predefined template. The resulting logs will be printed to the console and no file will be written.

```
$ ./log-generator.js generate -t app -c 10 -w -f null
writing 100 log entries to generated_2024-08-22.log
```

