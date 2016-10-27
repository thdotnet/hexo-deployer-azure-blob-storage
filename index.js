hexo.extend.deployer.register('azure', function(args){
	require('./lib/hexo-azure-blob-deployer')(args, this.config);	
});