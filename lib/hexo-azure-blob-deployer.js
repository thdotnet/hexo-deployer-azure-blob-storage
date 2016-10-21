var azure = require('azure-storage');
var walk  = require('walk');

module.exports = function(args) {

	var log = this.log;
	
	var config = {
		storageAccount:{
			storageAccountName: args.storage_account_name,
			storageAccessKey: args.storage_access_key
		},
		blobStorage: {
			containerName: args.azure_container_name
		}
	};

	var walker  = walk.walk(this.config.public_dir, { followLinks: false });

	var blobService = azure.createBlobService(config.storageAccount.storageAccountName, config.storageAccount.storageAccessKey);

	var objAccessLevel = {
		publicAccessLevel: 'blob'
	};
	
	var containerName = config.blobStorage.containerName;

	blobService.createContainerIfNotExists(containerName, objAccessLevel, function(error, result, response) 
	{
		if(error) 
		{
			log.err(error);
			return;
		}

		log.info('Uploading...');
		
		walker.on('file', function(root, stat, next) 
		{
			var blobName = stat.name;
			var fileName = root + '/' + stat.name;		
		
			blobService.createBlockBlobFromLocalFile(containerName, blobName, fileName, function(error, result, response) {
				if(!error) 
				{
					log.info(blobName + " uploaded with success");
				}
				else
				{
					log.info("Error during the upload of file: " + blobName);
					log.err(error);
				}
				
				next();
			});		
		});
		
		walker.on('end', function() {
			log.info("End");
		});
		// if result = true, container was created.
		// if result = false, container already existed.
	});
};