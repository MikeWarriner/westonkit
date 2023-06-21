'use strict';

const SerialPort = require('serialport');
const args = require('commander');
args
  .version(version)
  .usage('-p <port> [options]')
  .description('Helvar serial port server. Pressing ctrl+c exits.')
  .option('-l --list', 'List available ports then exit')
  //.option('-p, --port <port>', 'Path or Name of serial port')
  //.option('--server <server>', 'URL of server to communicate with')
  //.option('--server <server>', 'URL of server to communicate with')
  .parse(process.argv);

function listPorts() {
    SerialPort.list((err, ports) => {
      if (err) {
        console.error('Error listing ports', err);
      } else {
        ports.forEach((port) => {
          console.log(`${port.comName}\t${port.pnpId || ''}\t${port.manufacturer || ''}`);
        });
      }
    });
  };

  /*
  
  if (!args.port) {
    args.outputHelp();
    args.missingArgument('port');
    process.exit(-1);
  }
  
  */


  (async () => {
    try {
        if (args.listPorts)
            listPorts();
        else
        console.log("UNknown command");
      
    } catch (e) {
      // Deal with the fact the chain failed
      console.log("Exception in outer loop")
      console.log(e);
      process.exit(0);
    }
  })();
  
  