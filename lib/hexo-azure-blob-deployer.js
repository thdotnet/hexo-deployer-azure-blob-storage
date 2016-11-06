var fs = require('fs');
var azure = require('azure-storage');

module.exports = function(args, configFile) {
			
	var config = {
		storageAccount:{
			storageAccountName: args.storage_account_name,
			storageAccessKey: args.storage_access_key
		},
		blobStorage: {
			containerName: args.azure_container_name
		}
	};
	
	if (!args.storage_account_name || !args.storage_access_key || !args.azure_container_name) {
		var help = '';

		help += 'You should configure deployment settings in _config.yml first!\n\n';
		help += 'Example:\n';
		help += '  deploy:\n';
		help += '    type: azure\n';
		help += '    [storage_account_name]: <storage_account_name> \n';
		help += '    [storage_access_key]: <storage_access_key> \n';
		help += '    [azure_container_name]: <azure_container_name>\n';
		help += 'For more help, you can check the docs: https://github.com/thdotnet/hexo-deployer-azure-blob-storage';

		console.log(help);
		return;
	}
	
	var blobService = azure.createBlobService(config.storageAccount.storageAccountName, config.storageAccount.storageAccessKey);

	var objAccessLevel = {
		publicAccessLevel: 'blob'
	};
	
	var containerName = config.blobStorage.containerName;
	
	blobService.createContainerIfNotExists(containerName, objAccessLevel, function(error, result, response) {
		if(error) 
		{
			console.log(error);
			return;
		}

			console.log('Uploading...');

			var rootPath = configFile.public_dir;
			var files = [];
			var pathcomponent = require('path');

			var getFiles = function(path, subpath, files) {			
				fs.readdirSync(path).forEach(function(file)
				{
					if(!!file && file[0] == '.') return;
					
					var fileName = pathcomponent.join(path, subpath, file);
		
					if(fs.lstatSync(fileName).isDirectory())
					{
						getFiles(fileName, "", files);
					} 
					else 
					{										
						var blobName = pathcomponent.relative(rootPath, fileName).replace(pathcomponent.sep, "/");
						
						var obj = {
							"file": fileName,
							"subpath": subpath,
							"blobName": blobName
						};
						
						files.push(obj);
					}
				});
			};
			
			var uploadFiles = function(files, blobService) {
				if(!!files)
				{
					for(var i = 0; i < files.length; i++)
					{
						var obj = files[i];
						
						blobService.createBlockBlobFromLocalFile(containerName, obj.blobName, obj.file, function(error, result, response) 
						{					
							if(error) {						
								console.log(error);
							}		
						});
					}
					console.log("end");
				}
			};	

			getFiles(rootPath, "", files);
			uploadFiles(files, blobService);
	});
};