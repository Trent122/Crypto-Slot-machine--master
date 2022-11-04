import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import contractAddress from '../contractsData/SlotMachine-address.json';
import randomizerAddress from '../contractsData/Randomizer-address.json';
import contractAbi from '../contractsData/SlotMachine.json';
import randomizerAbi from '../contractsData/Randomizer.json';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import cherries from '../resources/tiles/cherries.png';
import club from '../resources/tiles/club.png';
import diamond from '../resources/tiles/diamond.png';
import heart from '../resources/tiles/heart.png';
import joker from '../resources/tiles/joker.png';
import spade from '../resources/tiles/spade.png';
import seven from '../resources/tiles/seven.png';

const App = () => {
  const { address, isConnected } = useAccount();
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [randomizer, setRandomizer] = useState(null);
  const [betAmount, setBetAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [audio, setAudio] = useState(true);


  const [spinning, setSpinning] = useState(false);
  const [init, setInit] = useState(false);

  const [balance, setBalance] = useState(0);

  const [slot1, setSlot1] = useState(1);
  const [slot2, setSlot2] = useState(1);
  const [slot3, setSlot3] = useState(1);

  const [slot1Image, setSlot1Image] = useState(null);
  const [slot2Image, setSlot2Image] = useState(null);
  const [slot3Image, setSlot3Image] = useState(null);

  let slotArray = [cherries, club, diamond, heart, joker, spade, seven];

  useEffect(() => {
    loadContracts();
  }, [init]);

  useEffect(() => {
    loadSlots();
  }, [slot1, slot2, slot3]);

  useEffect(() => {
    if(contract != null){
      updateBalance();
    }
  }, [contract, totalAmount])

  const updateBalance = async () => {
    const bal = await contract.playerBalance(address);
      setBalance(bal);
      console.log("balanceupdated")
  }

  //loading contracts
  const loadContracts = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);

      const slotMachine = new ethers.Contract(
        contractAddress.address,
        contractAbi.abi,
        signer
      );
      setContract(slotMachine);

      

      const randomizer = new ethers.Contract(
        randomizerAddress.address,
        randomizerAbi.abi,
        signer
      );
      setRandomizer(randomizer);

      const tx = await randomizer.firstTime();
      setInit(tx);

      console.log('Contracts Loaded!');
    } catch (err) {
      console.log(err);
    }
  };

  const loadSlots = async () => {
    for (let i = 1; i <= 7; i++) {
      slot1 == i && setSlot1Image(slotArray[i - 1]);
      slot2 == i && setSlot2Image(slotArray[i - 1]);
      slot3 == i && setSlot3Image(slotArray[i - 1]);
    }
  };

  const spinMachine = async () => {
    try {
      setSpinning(true);
      const amount = ethers.utils.parseEther(betAmount);
      const spinIt = await contract.spin(amount, { gasLimit: 1000000 });
      const tx = await spinIt.wait();
      setSpinning(false);
      setSlot1(tx.events[1].args[0].toString());
      setSlot2(tx.events[1].args[1].toString());
      setSlot3(tx.events[1].args[2].toString());
      if(slot1 == slot2 || slot2 == slot3 || slot1 == slot3){
        alert("You have Won!")
      }else if(slot1 == 7 || slot2 == 7 || slot1 == 7){
        alert("JACKPOTTT!!")
      }else{
        alert("Sorry! You didn't win anything")
      }
    } catch (err) {
      console.log(err);
      setSpinning(false);
    }
  };

  const fundContract = async () => {
    const amount = ethers.utils.parseEther(totalAmount);
    const fund = await contract.sendFundsToContract({
      value: amount,
      gasLimit: '1000000',
    });
    await fund.wait();
    setTotalAmount(0);
  };

  const toggleAudio = () => {
    setAudio(!audio);
  };

  const requestRand = async () => {
    
    const tx = await randomizer.requestRandomWords({ gasLimit: 10000000 });
    await tx.wait();
  };

  const renderInitializeButton = () => {
    return(
      <button className='btn btn-primary' onClick={requestRand}>Initialize App</button>
    )
  }

  const withdraw = async () =>{
    const tx = await contract.withdrawFunds();
    await tx.wait();
  }


  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-expand-md navbar-light'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>
            SlotMachine
          </a>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'></ul>
            <ConnectButton></ConnectButton>
          </div>
        </div>
      </nav>
      <div className='container d-flex'>
        <div className='col-lg-6 mt-3 pt-5 m-auto'>
          {init ? renderInitializeButton() : (<><section id='status'>WELCOME!</section>
          <section id='Slots'>
            <div id='slot1' className='a1'>
               <img src={slot1Image} />
            </div>
            <div id='slot2' className='a1'>
              <img src={slot2Image} />
            </div>
            <div id='slot3' className='a1'>
              <img src={slot3Image} />
            </div>
          </section>
          <section id='Gira'>
            <input
              type='number'
              className='betAmount'
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />
            <button className='spin-button' onClick={() => spinMachine()}>TAKE A SPIN!</button>
          </section>
          <section>
            <div className='input-group mb-3 mt-3'>
              <input
                type='number'
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className='form-control'
                placeholder='Amount in Eth'
                aria-label="Recipient's username"
                aria-describedby='button-addon2'
              />
              <button
                className='btn btn-outline-secondary'
                type='button'
                id='button-addon2'
                onClick={() => fundContract()}
              >
                Fund ETH
              </button>
              
            </div>
            <div className='text-center'>
            <div className='lead'>Your Balance {balance.toString()/10**18} ETH
            
            </div>
            <button className='btn btn-danger mt-2' onClick={() => withdraw()}>Withdraw Balance</button>
            </div>

          </section></>) }
          
        </div>
      </div>
    </div>
  );
};

export default App;
