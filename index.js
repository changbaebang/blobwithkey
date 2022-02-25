const crypto = require('crypto');
const superagent = require('superagent');
const parseString = require('xml2js').parseString;

const _date = 'x-ms-date';
const _version = 'x-ms-version'; 
const _authorization = 'Authorization';
const date = new Date().toUTCString();
const version = "2020-02-10";

/**
 * Gets the list of blobs inside a container
 * @param {string} accessToken token to access the storage account
 * @param {string} storageAccountName name of the storage account
 * @param {string} container the container to access within the storage account
*/
async function getBlobList(accessKey, storageAccountName, container) {
  
  const url = "https://" + storageAccountName + ".blob.core.windows.net";
  const paramString = "?restype=container&comp=list&maxresults=5";
  // canonicalParamString should always be in alphabetical order
  const canonicalParamString = "\ncomp:list\nmaxresults:5\nrestype:container";
  const signature = generateSignature(accessKey, "GET", storageAccountName, 
                                      container, null, canonicalParamString);
  
  const authValue = "SharedKey " + storageAccountName + ":" + signature;
  
  return new Promise((resolve) => {
    superagent
      .get(url + '/' + container + paramString)
      .set(_version, version)
      .set(_date, date)
      .set(_authorization, authValue)
      .then((res) => {
        console.info('Return: ' + JSON.stringify(res));
        const json = parseString(res.body, (err, resut) => console.error(err + JSON.stringify(resut)));
        resolve(json);
      }).catch((err) => {
        console.error('Error: ' + err.message + '\n');
        console.error(JSON.stringify(err.response));        
    });
  });
}


async function getBlockList(accessKey, storageAccountName, container, blob) {
  
    const url = "https://" + storageAccountName + ".blob.core.windows.net";
    const paramString = "?comp=blocklist";
    // canonicalParamString should always be in alphabetical order
    const canonicalParamString = "\ncomp:blocklist";
    const signature = generateSignature(accessKey, "GET", storageAccountName, 
                                        container, blob, canonicalParamString);
    
    const authValue = "SharedKey " + storageAccountName + ":" + signature;
    
    return new Promise((resolve) => {
      superagent
        .get(url + '/' + container + '/' + blob +  paramString)
        .set(_version, version)
        .set(_date, date)
        .set(_authorization, authValue)
        .then((res) => {
          console.info('Return: ' + JSON.stringify(res));
          const json = parseString(res.body, (err, resut) => console.error(err + JSON.stringify(resut)));
          resolve(json);
        }).catch((err) => {
          console.error('Error: ' + err.message + '\n');
          console.error(JSON.stringify(err.response));
          //const json = parseString(err.body, (err, resut) => console.error(err + JSON.stringify(resut)));
          //console.error(Object.keys(err));
          //console.error(err.status);
          //console.error(Object.keys(err.response));
          //console.error(err.response.body);
          const json = parseString(err.response.body, (err, resut) => console.error(err + JSON.stringify(resut)));

      });
    });
  }


  async function deleteBlob(accessKey, storageAccountName, container, blobname, versionId, permanent) {
  
    //https://bangbnag0001nopublic.blob.core.windows.net/test/1.txt/test?versionId=2022-02-23T10:55:02.5879709Z
    //https://bangbnag0001nopublic.blob.core.windows.net/test/1.txt?versionId=2022-02-23T10:55:02.5879709Z&deletetype=permanent
    //https://bangbnag0001nopublic.blob.core.windows.net/test/1.txt?versionId=2022-02-23T10:55:02.5879709Z

    const url = "https://" + storageAccountName + ".blob.core.windows.net/" + container + "/" + blobname;
    //const paramString = versionId ? "?versionid=" + versionId + (permanent === true ? "&deletetype=permanent" : "") : ""
    const paramString = "?" + (permanent === true ? "deletetype=permanent&" : "") + "versionid=" + versionId;
    // canonicalParamString should always be in alphabetical order
    const canonicalParamString = (permanent === true ? "\ndeletetype:permanent" : "") + "\nversionid:" + versionId; 
    const signature = generateSignature(accessKey, "DELETE", storageAccountName, 
                                        container, blobname, canonicalParamString);
    
    const authValue = "SharedKey " + storageAccountName + ":" + signature;
    
    console.log(url);
    return new Promise((resolve) => {
      superagent
        .delete(url + paramString)
        .set(_version, version)
        .set(_date, date)
        .set(_authorization, authValue)
        .then((res) => {
          console.info('Return: ' + JSON.stringify(res));
          const json = parseString(res.body, (err, resut) => console.error(err + JSON.stringify(resut)));
          resolve(json);
        }).catch((err) => {
          console.error('Error: ' + err.message + '\n');
          console.error(JSON.stringify(err));        
          console.error(JSON.stringify(err.response));        
      });
    });
  }

  async function getBlob(accessKey, storageAccountName, container, blobname, versionId, permanent) {
  
    //https://bangbnag0001nopublic.blob.core.windows.net/test/1.txt/test?versionId=2022-02-23T10:55:02.5879709Z
    //https://bangbnag0001nopublic.blob.core.windows.net/test/1.txt?versionId=2022-02-23T10:55:02.5879709Z&deletetype=permanent
    //https://bangbnag0001nopublic.blob.core.windows.net/test/1.txt?versionId=2022-02-23T10:55:02.5879709Z

    const url = "https://" + storageAccountName + ".blob.core.windows.net/" + container + "/" + blobname;
    //const paramString = versionId ? "?versionId=" + versionId + (permanent === true ? "&deletetype=permanent" : "") : ""
    const paramString = "?" + /*"deletetype=permanent" + "&" +*/ "versionid=" + "2022-02-24T02:52\:45.4656302Z"; //versionId; 
    // canonicalParamString should always be in alphabetical order
    const canonicalParamString = /*"\ndeletetype:permanent*/ "\nversionid:" + "2022-02-24T02\:52\:45.4656302Z"; //versionId; 
    const signature = generateSignature(accessKey, "GET", storageAccountName, 
                                        container, blobname, canonicalParamString);
    
    const authValue = "SharedKey " + storageAccountName + ":" + signature;
    
    console.log(url);
    return new Promise((resolve) => {
      superagent
        .get(url + paramString)
        .set(_version, version)
        .set(_date, date)
        .set(_authorization, authValue)
        .then((res) => {
          console.info('Return: ' + JSON.stringify(res));
          const json = parseString(res.body, (err, resut) => console.error(err + JSON.stringify(resut)));
          resolve(json);
        }).catch((err) => {
          console.error('Error: ' + err.message + '\n');
          console.error(JSON.stringify(err));        
          console.error(JSON.stringify(err.response));        
      });
    });
  }

/**
 * Generates the signature for auth header
 * @param {string} accessKey access key for the required storage account
 * @param {string} methodName HTTP method type
 * @param {string} containerName name of the container inside the storage account
 * @param {string} canonicalResourceString alphabetically sorted query params
*/
function generateSignature(accessKey, methodName , storageAccountName,
                               containerName, blob, canonicalResourceString) {

  // construct input value, all the headers need to be in the below order
  const inputvalue = methodName + "\n" + /*VERB*/
        "\n" + /*Content-Encoding*/
        "\n" + /*Content-Language*/
        "\n" + /*Content-Length*/
        "\n" + /*Content-MD5*/
        "\n" + /*Content-Type*/
        "\n" + /*Date*/
        "\n" + /*If-Modified-Since*/
        "\n" + /*If-Match*/
        "\n" + /*If-None-Match*/
        "\n" + /*If-Unmodified-Since*/
        "\n" + /*Range*/
        "x-ms-date:" + date + "\n" +
        "x-ms-version:" + version + "\n" +
        "/" + storageAccountName + "/" + containerName + (blob != null ? "/" + blob : "" ) + canonicalResourceString;
        // The resource string (after containerName) needs to be in alphabetical order

  console.info('inputvalue:' + inputvalue)
  // create base64 encoded signature
  const key = new Buffer(accessKey, "base64");
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(inputvalue);
  const signature = hmac.digest("base64");

  return signature;
}


//getBlobList('...','defaultsizecheck','testsize');
//getBlockList('...','defaultsizecheck','testsize', 'zulu-11-azure-jdk_11.43.55-11.0.9.1-win_x64.msi');
//getBlockList('...','defaultsizecheck','testsize', 'pcc-mhub-retail-web.zip');
//getBlockList('...','defaultsizecheck','testsize', 'Deployment-Oryx-Samples-master.zip');
// 4194304 = 4
//getBlockList('...','defaultsizecheck','testsize', 'TablePlusSetup.exe');
// 4194304 = 4
//getBlockList('...','defaultsizecheck','testsize', 'Windows_Server_2016_Datacenter_EVAL_en-us_14393_refresh.ISO');
// 4194304 = 4
//getBlobList('...', 'bangbnag0001nopublic', 'test');
//deleteBlob('...', 'bangbnag0001nopublic', 'test', '1.txt', '2022-02-23T10:54:57.1261450Z', true);
//deleteBlob('...', 'bangtestdelete', 'test', '1.txt', '2022-02-24T02:52:45.4656302Z', true);
//deleteBlob('...', 'bangbnag0001nopublic', 'test', '1.txt', '2022-02-23T10:54:57.1261450Z', false);

deleteBlob('...', 'bangtestdelete', 'test', '1.txt', '2022-02-24T02:52:42.7292911Z', true);
//getBlob('...', 'bangtestdelete', 'test', '1.txt', '2022-02-24T02:52:45.4656302Z', true);
//https://bangtestdelete.blob.core.windows.net/test/1.txt?versionId=2022-02-24T02:52:45.4656302Z