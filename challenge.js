import { Web5 } from '@web5/api';
import { VerifiableCredential } from '@web5/credentials';

/*
Needs globalThis.crypto polyfill. 
Thisa is *not* the crypto you're thinking of.
It's the original crypto...CRYPTOGRAPHY.
*/
import { webcrypto } from 'node:crypto';

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;


// ---------------step 1-----------------

//creating did for bob---->
const { web5, did: bobDid } = await Web5.connect();

//creating bearer id for bob---->
const { did: bobBearerDid } = await web5.agent.identity.get({ didUri: bobDid });

//console.log(bobDid);

//console.log(bobBearerDid);

//creating veriafiable credentials---->

const aliceDid = 'did:dht:rr1w5z9hdjtt76e6zmqmyyxc5cfnwjype6prz45m6z1qsbm8yjao';


const vc = await VerifiableCredential.create({
    type: 'creatingVerifiableCredentialForAlice',
    issuer: bobDid,
    subject: aliceDid,
    data: {
      name: 'Alice Smith',
      completionDate: new Date().toISOString(),
      //expertiseLevel: 'Beginner'
    }
  });
  
//console.log(vc);

//signing veriafiable credentials---->

const signedVc = await vc.sign({ did: bobBearerDid });

const { record } = await web5.dwn.records.create({
    data: signedVc,
    message: {
      schema: 'DecentralizedWebNodes',
      dataFormat: 'application/vc+jwt',
      published: true
    }
  });

  //console.log('writeResult', record);