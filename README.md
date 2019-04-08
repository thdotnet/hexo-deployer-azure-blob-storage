# hexo-deployer-azure-blob-storage
Azure Blob Storage deployer plugin for Hexo

Installation

$ npm install hexo-deployer-azure-blob-storage --save

Setup

You must provide the following parameters in the _config.yml file:

```
deploy:
  type: azure
  storage_account_name: <storage_account_name>
  storage_access_key: <storage_access_key>
  azure_container_name: hexo # you can change if you want. Only lowercase letters and no special chars are allowed.
 ```

Usage

$ hexo deploy

License

MIT
