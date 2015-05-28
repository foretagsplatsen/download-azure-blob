#!/usr/bin/env node

var storage_name,
    container_name,
    blob_name,
    primary_key;

function exitHelp(extra) {
  if(extra) {
    console.log(extra + "\n");
  }
  console.log("download-azure-blob storage=storage-name container=container-name blob=blob-name secret=primary-key\n\n\
    Azure blob URLs match: https://[storage-name].blob.core.windows.net/[container-name]/[blob-name]\n\
    primary-key can be found executing `azure storage account keys list [storage-name]`");
  process.exit(1);
};

process.argv.forEach(function(val, index, array) {
  if(index < 2) {
    return;
  }
  var keyVal = val.split('=');
  var key = keyVal[0];
  keyVal.splice(0, 1);
  var value = keyVal.join("=");

  switch (key) {
    case "storage": 
      storage_name = value;
      break;
    case "container":
      container_name = value;
      break;
    case "blob":
      blob_name = value;
      break;
    case "secret":
      primary_key = value;
      break;
    default:
      exitHelp("Unsupported option: " + key + ".");
  }
});

if(!storage_name) {
  exitHelp("Required argument `storage`.");
  exitHelp();
}
if(!container_name) {
  exitHelp("Required argument `container`.");
  exitHelp();
}
if(!blob_name) {
  exitHelp("Required argument `blob`.");
  exitHelp();
}
if(!primary_key) {
  exitHelp("Required argument `secret`./n The key can be found running `azure storage account keys list " + storage_name + "`");
}

var azure = require('azure-storage');
var fs = require('fs');

var blobSvc = azure.createBlobService(storage_name, primary_key);
blobSvc.getBlobToStream(container_name, blob_name, fs.createWriteStream(blob_name), function(error, result, response){
  if(error){
    throw error;
  }
  console.log(blob_name + " successfully downloaded");
  process.exit(0);
});