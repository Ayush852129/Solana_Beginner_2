
// Create the functionality for the button titled “Create a new Solana account” that generates a new KeyPair at the backend and airdrops 2 SOL to the newly created Keypair.
// Once this step is completed, create the functionality for the next button that says - “Connect to Phantom Wallet”, which should connect to the Phantom Wallet if it exists.
// Once this step is completed, create the final functionality for a button called “Transfer SOL to New Wallet”. This button should trigger a transfer of 1 SOL (airdropped into the account you generated in step 1) to the account connected in Step 2.

import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from '@solana/web3.js';




function App() {

  const [keypair,setkeypair]=useState();
  const [connection,setConnection]=useState();
  const [fromkey,setFromKey]=useState();
  const [tokey,setToKey]=useState();

  const Create = async () =>
  {   
    // generating a new keypair
      const keypair=Keypair.generate();
      setkeypair(keypair);
      setFromKey(new PublicKey(keypair.publicKey).toString());
      console.log("KeyPair generated Successfully");
      console.log("KeyPair_Publickey :",fromkey);

      try
      {
          const connection=new Connection(clusterApiUrl('devnet','confirmed'));
          setConnection(connection);
          // console.log(connection);
          // Airdrop 2 sol 
           await connection.requestAirdrop({
            to:fromkey,
            lamports:LAMPORTS_PER_SOL * 2 
          });
          
          console.log(" Airdropped 2 sol to ",fromkey);
          
      }catch(err)
      {
        console.error(err);
      }
  }

  const Connect = async () =>
  {
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        setToKey(response.publicKey.toString());
        console.log(" Phantom PublicKey : ",response.publicKey.toString());
      } catch (err) {
        console.log(err);
        alert(err);
      }
    }
  }


  const Transfer =async () =>
  {
    console.log("Transaction onging ..........");
    try
    {
        const transaction =new Transaction();
        const instruction= SystemProgram.transfer({
          fromPubkey:fromkey,
          toPubkey:tokey,
          lamports:LAMPORTS_PER_SOL*1
        });

        transaction.add(instruction);

        const signature=await sendAndConfirmTransaction({
          connection:connection,
          transaction:transaction,
          signers:[keypair]
        });

        transaction.wait();

        console.log("signatue : ",signature);

    }catch(err)
    {
      console.error(err);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={Create}>Create a new Solana account</button>
        <button onClick={Connect}>Connect to Phantom Wallet</button>
        <button onClick={Transfer}>Transfer SOL to New Wallet</button>
      </header>
    </div>
  );
}

export default App;
