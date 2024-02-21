import React, { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import "./App.css"; // Import CSS file
import myImage from './torr.png';
// import background from './background.jpg';


import { FaAngleRight } from "react-icons/fa";
import { AiFillTwitterCircle, AiFillInstagram, AiFillSkype } from "react-icons/ai";
import { BsFacebook, BsLinkedin } from "react-icons/bs";
import { FaArrowUp } from 'react-icons/fa';


// Import your ERC20 token ABI here
import tokenABI from "./abi.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState("0");
  const [totalSupply, setTotalSupply] = useState("0");
  const [tokenName, setTokenName] = useState("");
  const [decimals, setDecimals] = useState("0");
  const [tokenContract, setTokenContract] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [spenderAddress, setSpenderAddress] = useState("");

  // Define token contract address
  const tokenContractAddress = "0xf3835Ec05b4A68f11a8D02E19ba2006152954D02";

  // Function to fetch token details before connecting to MetaMask
  const fetchTokenDetails = async () => {
    try {
      const provider = await detectEthereumProvider();
      const web3Instance = new Web3(provider);
      const contract = new web3Instance.eth.Contract(
        tokenABI,
        tokenContractAddress
      );

      const [name, totalSupply, decimals] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.totalSupply().call(),
        contract.methods.decimals().call(),
      ]);

      // Update state with raw values
      setTokenName(name);
      setTotalSupply(totalSupply);
      setDecimals(decimals);
    } catch (error) {
      console.error("Error fetching token details:", error);
    }
  };

  useEffect(() => {
    if (web3 && accounts.length > 0) {
      // Initialize token contract
      const contract = new web3.eth.Contract(tokenABI, tokenContractAddress);
      setTokenContract(contract);

      // Fetch token details
      contract.methods
        .totalSupply()
        .call()
        .then((totalSupply) => setTotalSupply(totalSupply))
        .catch(console.error);

      contract.methods
        .name()
        .call()
        .then((name) => setTokenName(name))
        .catch(console.error);

      contract.methods
        .decimals()
        .call()
        .then((decimals) => setDecimals(decimals))
        .catch(console.error);

      // Get token balance
      contract.methods
        .balanceOf(accounts[0])
        .call()
        .then((balance) => setBalance(balance))
        .catch(console.error);
    }
  }, [web3, accounts]);

  // Initial fetch of token details
  useEffect(() => {
    fetchTokenDetails();
  }, []);

  useEffect(() => {
    const init = async () => {
      // Detect MetaMask provider
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);

        // Request access to MetaMask account
        try {
          const accounts = await provider.request({
            method: "eth_requestAccounts",
          });
          setAccounts(accounts);
        } catch (error) {
          console.error("User rejected MetaMask access");
        }
      } else {
        console.error("MetaMask not detected");
      }
    };

    init();
  }, []);

  // Transfer tokens
  const transferTokens = async () => {
    try {
      await tokenContract.methods
        .transfer(transferTo, transferAmount)
        .send({ from: accounts[0] });
      alert("Transfer successful");
      // Update balance after transfer
      const newBalance = await tokenContract.methods
        .balanceOf(accounts[0])
        .call();
      setBalance(newBalance);
    } catch (error) {
      console.error(error);
      alert("Transfer failed");
    }
  };

  // Mint tokens
  const mintTokens = async () => {
    try {
      await tokenContract.methods
        .mint(recipient, amount)
        .send({ from: accounts[0] });
      alert("Minting successful");
      // Update balance after minting
      const newBalance = await tokenContract.methods
        .balanceOf(accounts[0])
        .call();
      setBalance(newBalance);
    } catch (error) {
      console.error(error);
      alert("Minting failed");
    }
  };

  // Burn tokens
  const burnTokens = async () => {
    try {
      await tokenContract.methods.burn(amount).send({ from: accounts[0] });
      alert("Burning successful");
      // Update balance after burning
      const newBalance = await tokenContract.methods
        .balanceOf(accounts[0])
        .call();
      setBalance(newBalance);
    } catch (error) {
      console.error(error);
      alert("Burning failed");
    }
  };

  // Stake tokens
  const stakeTokens = async () => {
    try {
      await tokenContract.methods.stake(amount).send({ from: accounts[0] });
      alert("Staking successful");
      // Update balance after staking
      const newBalance = await tokenContract.methods
        .balanceOf(accounts[0])
        .call();
      setBalance(newBalance);
    } catch (error) {
      console.error(error);
      alert("Staking failed");
    }
  };

  // Unstake tokens
  const unstakeTokens = async () => {
    try {
      await tokenContract.methods.unstake(amount).send({ from: accounts[0] });
      alert("Unstaking successful");
      // Update balance after unstaking
      const newBalance = await tokenContract.methods
        .balanceOf(accounts[0])
        .call();
      setBalance(newBalance);
    } catch (error) {
      console.error(error);
      alert("Unstaking failed");
    }
  };

  // Approve tokens
  const approveTokens = async () => {
    try {
      await tokenContract.methods
        .approve(spenderAddress, amount)
        .send({ from: accounts[0] });
      alert("Approval successful");
    } catch (error) {
      console.error(error);
      alert("Approval failed");
    }
  };

  // Multisend tokens
  const multisendTokens = async (recipients, amounts) => {
    try {
      if (recipients.length !== amounts.length) {
        console.error("Number of recipients and amounts should match.");
        return;
      }

      // Iterate through each recipient and amount pair
      for (let i = 0; i < recipients.length; i++) {
        // Send tokens to each recipient
        await tokenContract.methods
          .transfer(recipients[i], amounts[i])
          .send({ from: accounts[0] });
      }

      // Refresh balance
      const newBalance = await tokenContract.methods
        .balanceOf(accounts[0])
        .call();
      setBalance(newBalance);
    } catch (error) {
      console.error("Error sending tokens:", error);
    }
  };

  // Pause contract
  const pauseContract = async () => {
    try {
      await tokenContract.methods.pause().send({ from: accounts[0] });
      alert("Contract paused");
    } catch (error) {
      console.error(error);
      alert("Failed to pause contract");
    }
  };

  // Unpause contract
  const unpauseContract = async () => {
    try {
      await tokenContract.methods.unpause().send({ from: accounts[0] });
      alert("Contract unpaused");
    } catch (error) {
      console.error(error);
      alert("Failed to unpause contract");
    }
  };
  // Connect to MetaMask
  const connectToMetaMask = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
      } else {
        console.error("MetaMask not detected");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
      
        <h1>ERC20 Token Website</h1>
        <div className="card1">
        {/* <img className="bg" src={background} alt="bg" /> */}
          <p className="token-detail">
            Token Name: <span id="tokenName">{tokenName}</span>
          </p>
          <p className="token-detail">
            Connected Account:{" "}
            <span id="connectedAccount">
              {accounts.length > 0 ? accounts[0] : "Not connected"}
            </span>
          </p>
          <p className="token-detail">
            Token Balance:{" "}
            <span id="tokenBalance">
              {web3 && balance && web3.utils.fromWei(balance, "ether")}
            </span>
          </p>
          <p className="token-detail">
            Total Supply:{" "}
            <span id="totalSupply">
              {web3 && totalSupply && web3.utils.fromWei(totalSupply, "ether")}
            </span>
          </p>
          <p className="token-detail">
            Decimals: 10<span id="decimals">{decimals}</span>
          </p>
          <img  className="img"src={myImage} alt="img" />
        </div>
        <button className="connect-button" onClick={connectToMetaMask}>
          Connect with MetaMask
        </button>
        <div className="cards">
          <div className="card2">
            <h2 className="operation-heading">Transfer Tokens</h2>
            <input
              type="text"
              className="input-field"
              placeholder="Recipient Address"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
            <button className="operation-button" onClick={transferTokens}>
              Transfer
            </button>
          </div>
          <div className="card3">
            <h2 className="operation-heading">Mint Tokens</h2>
            <input
              type="text"
              className="input-field"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="operation-button" onClick={mintTokens}>
              Mint
            </button>
          </div>

          <div className="card4">
            <h2 className="operation-heading">Burn Tokens</h2>
            <input
              type="number"
              className="input-field"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="operation-button" onClick={burnTokens}>
              Burn
            </button>
          </div>
          <div className="card5">
            <h2 className="operation-heading">Stake Tokens</h2>
            <input
              type="number"
              className="input-field"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="operation-button" onClick={stakeTokens}>
              Stake
            </button>
          </div>
          <div className="card6">
            <h2 className="operation-heading">Unstake Tokens</h2>
            <input
              type="number"
              className="input-field"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="operation-button" onClick={unstakeTokens}>
              Unstake
            </button>
          </div>
          <div className="card7">
            <h2 className="operation-heading">Approve Tokens</h2>
            <input
              type="text"
              className="input-field"
              placeholder="Spender Address"
              value={spenderAddress}
              onChange={(e) => setSpenderAddress(e.target.value)}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="operation-button" onClick={approveTokens}>
              Approve
            </button>
          </div>
          <div className="card8">
            <div id="tokenOperations">
              <h2 className="operation-heading">Multi-send Tokens</h2>
              <p>Recipient Addresses: </p>
              <input
                type="text"
                className="input-field"
                placeholder="Recipient Addresses (comma-separated)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <p>Amounts: </p>
              <input
                type="text"
                className="input-field"
                placeholder="Amounts (comma-separated)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                className="button"
                onClick={() => {
                  const recipientsArray = recipient
                    .split(",")
                    .map((addr) => addr.trim());
                  const amountsArray = amount
                    .split(",")
                    .map((amt) => amt.trim());
                  multisendTokens(recipientsArray, amountsArray);
                }}
              >
                Multi-send Tokens
              </button>
            </div>
          </div>
          <div className="card9">
            <h2 className="operation-heading">Pause/Unpause Contract</h2>
            <button className="operation-button" onClick={pauseContract}>
              Pause Contract
            </button>
            <button className="operation-button" onClick={unpauseContract}>
              Unpause Contract
            </button>
          </div>
        </div>
      </header>
      <section className='footer'>

        <div class="footer-top">
          <div class="box">
            <div class="row">

              <div class="col-lg-3 col-md-6 footer-contact">
                <h3>ERC-20 Token</h3>
                <p>
                  GLA UNIVERSITY <br />
                  mathura, UP 281406<br />
                  INDIA <br /><br />
                  <strong>Phone:</strong> +1 5589 55488 55<br />
                  <strong>Email:</strong> shopingzone@gmail.com<br />
                </p>
              </div>

              <div class="col-lg-3 col-md-6 footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li><FaAngleRight /> <a href="#">Home</a></li>
                  <li><FaAngleRight /> <a href="#">About us</a></li>
                  <li><FaAngleRight /> <a href="#">Services</a></li>
                  <li><FaAngleRight /> <a href="#">Terms of service</a></li>
                  <li><FaAngleRight /> <a href="#">Privacy policy</a></li>
                </ul>
              </div>

              <div class="col-lg-3 col-md-6 footer-links">
                <h4>Our Services</h4>
                <ul>
                  <li><FaAngleRight /><a href="#">Web Design</a></li>
                  <li><FaAngleRight /> <a href="#">Web Development</a></li>
                  <li><FaAngleRight /> <a href="#">Product Management</a></li>
                  <li><FaAngleRight /><a href="#">Marketing</a></li>
                  <li><FaAngleRight /> <a href="#">Graphic Design</a></li>
                </ul>
              </div>

              <div class="col-lg-3 col-md-6 footer-links">
                <h4>Our Social Networks</h4>
                <p>Fallow our social media handle for more update.make batter create batter in your life.(o!o)</p>
                <div class="social-links mt-3">
                  <a href="/" class="twitter"><AiFillTwitterCircle /></a>
                  <a href="/" class="facebook"><BsFacebook /></a>
                  <a href="/" class="instagram"><AiFillInstagram /></a>
                  <a href="/" class="google-plus"><AiFillSkype /></a>
                  <a href="/" class="linkedin"><BsLinkedin /></a>
                </div>
              </div>
            </div>

            <div className="copyright">
              <p> &copy; {new Date().getFullYear()} Shopint zone. All rights reserved.</p>
              <p> Designed by <a href="https://github.com/Abhishek9793web">Resume maker</a></p>
            </div>
          </div>
          <a href="/" className="back-to-top "><FaArrowUp /></a>
        </div>


      </section>

    

      <footer className="footer">
        <p className="footer-text">© 2023 E-Commerce Store. All rights reserved.</p>
      </footer>
    </div>


    
    
  );
}

export default App;










// import React, { useState, useEffect, useCallback } from 'react';
// import Web3 from 'web3';
// import TheodoresTokenABI from './abi.json'; // Import the ABI of your deployed contract
// import './App.css';

// function App() {
//   const [contract, setContract] = useState(null);
//   const [account, setAccount] = useState('');
//   const [balance, setBalance] = useState(0);
//   const [transferTo, setTransferTo] = useState('');
//   const [transferAmount, setTransferAmount] = useState(0);
//   const [recipient, setRecipient] = useState('');
//   const [amount, setAmount] = useState('');
//   const [totalSupply, setTotalSupply] = useState(0);
//   const [tokenName, setTokenName] = useState('');
//   const [decimals, setDecimals] = useState(0);
//   const [spenderAddress, setSpenderAddress] = useState('');
//   const [amount1, setAmount1] = useState(0); // State for amount1
//   const [amount2, setAmount2] = useState(0); // State for amount2
//   const [amount3, setAmount3] = useState(0);

//   // Define fetchBalance function
//   const fetchBalance = useCallback(async (account, contractInstance) => {
//     try {
//       const balance = await contractInstance.methods.balanceOf(account).call();
//       setBalance(balance);
//     } catch (error) {
//       console.error(error);
//     }
//   }, []);

//   const init = useCallback(async () => {
//     if (window.ethereum) {
//       try {
//         const web3Instance = new Web3(window.ethereum);
//         await window.ethereum.enable();
//         const accounts = await web3Instance.eth.getAccounts();
//         setAccount(accounts[0]);
//         const contractInstance = new web3Instance.eth.Contract(
//           TheodoresTokenABI,
//           '0x44130412db812e454031014904AA7794002C63F8'
//         );
//         setContract(contractInstance);

//         // Fetch additional data
//         const tokenName = await contractInstance.methods.name().call();
//         setTokenName(tokenName);
//         console.log('Token Name:', tokenName);
//         const decimals = await contractInstance.methods.decimals().call();
//         setDecimals(decimals);
//         console.log('Decimals:', decimals);
//         const totalSupply = await contractInstance.methods.totalSupply().call();
//         setTotalSupply(totalSupply);
//         console.log('Total Supply:', totalSupply);

//         // Fetch balance
//         await fetchBalance(accounts[0], contractInstance);
//       } catch (error) {
//         console.error(error);
//       }
//     } else {
//       console.error('Please install MetaMask');
//     }
//   }, [fetchBalance]);
//   const handleClick = () => {
//     // Call init function when the button is clicked
//     init();
//   };

//   // Transfer tokens
//   const transferTokens = async () => {
//     try {
//       await contract.methods.transfer(transferTo, transferAmount).send({ from: account });
//       alert('Transfer successful');
//       // Update balance after transfer
//       await fetchBalance(account, contract);
//     } catch (error) {
//       console.error(error);
//       alert('Transfer failed');
//     }
//   };

//   // Mint tokens
//   const mintTokens = async () => {
//     try {
//       await contract.methods.mint(recipient, amount).send({ from: account });
//       alert('Minting successful');
//       // Update balance after minting
//       await fetchBalance(account, contract);
//     } catch (error) {
//       console.error(error);
//       alert('Minting failed');
//     }
//   };

//   // Burn tokens
//   const burnTokens = async () => {
//     try {
//       await contract.methods.burn(amount).send({ from: account });
//       alert('Burning successful');
//       // Update balance after burning
//       await fetchBalance(account, contract);
//     } catch (error) {
//       console.error(error);
//       alert('Burning failed');
//     }
//   };

//   // Stake tokens
//   const stakeTokens = async () => {
//     try {
//       await contract.methods.stake(amount).send({ from: account });
//       alert('Staking successful');
//       // Update balance after staking
//       await fetchBalance(account, contract);
//     } catch (error) {
//       console.error(error);
//       alert('Staking failed');
//     }
//   };

//   // Unstake tokens
//   const unstakeTokens = async () => {
//     try {
//       await contract.methods.unstake(amount).send({ from: account });
//       alert('Unstaking successful');
//       // Update balance after unstaking
//       await fetchBalance(account, contract);
//     } catch (error) {
//       console.error(error);
//       alert('Unstaking failed');
//     }
//   };
//   // Add approve function
//   const approveTokens = async () => {
//     try {
//       await contract.methods.approve(spenderAddress, amount).send({ from: account });
//       alert('Approval successful');
//     } catch (error) {
//       console.error(error);
//       alert('Approval failed');
//     }
//   };

//   // Add Multisend function
//   const multisendTokens = async () => {
//     const recipients = ['address1', 'address2', 'address3']; // List of recipient addresses
//     const amounts = [amount1, amount2, amount3]; // Corresponding amounts to send to each address

//     try {
//       await contract.methods.multisend(recipients, amounts).send({ from: account });
//       alert('Multisend successful');
//     } catch (error) {
//       console.error(error);
//       alert('Multisend failed');
//     }
//   };

//   // Pause contract
//   const pauseContract = async () => {
//     try {
//       await contract.methods.pause().send({ from: account });
//       alert('Contract paused');
//     } catch (error) {
//       console.error(error);
//       alert('Failed to pause contract');
//     }
//   };

//   // Unpause contract
//   const unpauseContract = async () => {
//     try {
//       await contract.methods.unpause().send({ from: account });
//       alert('Contract unpaused');
//     } catch (error) {
//       console.error(error);
//       alert('Failed to unpause contract');
//     }
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Theodores Token</h1>
//         <p>Token Name: {tokenName}</p>
//         <button onClick={handleClick}>Connect MetaMask</button>
//         <p>Connected Account: {account}</p>
//         <p>Balance: {balance}</p>
//         <p>Total Supply: {totalSupply}</p>

//         <p>Decimals: {decimals}</p>

//         <h2>Transfer Tokens</h2>
//         <input type="text" placeholder="Recipient Address" value={transferTo} onChange={(e) => setTransferTo(e.target.value)} />
//         <input type="number" placeholder="Amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
//         <button onClick={transferTokens}>Transfer</button>

//         <h2>Mint Tokens</h2>
//         <input type="text" placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
//         <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
//         <button onClick={mintTokens}>Mint</button>

//         <h2>Burn Tokens</h2>
//         <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
//         <button onClick={burnTokens}>Burn</button>

//         <h2>Stake Tokens</h2>
//         <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
//         <button onClick={stakeTokens}>Stake</button>

//         <h2>Unstake Tokens</h2>
//         <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
//         <button onClick={unstakeTokens}>Unstake</button>

//         <h2>Approve Tokens</h2>
//         <input type="text" placeholder="Spender Address" value={spenderAddress} onChange={(e) => setSpenderAddress(e.target.value)} />
//         <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
//         <button onClick={approveTokens}>Approve</button>

//         <h2>Multisend Tokens</h2>
//         <input type="number" placeholder="Amount 1" value={amount1} onChange={(e) => setAmount1(e.target.value)} />
//         <input type="number" placeholder="Amount 2" value={amount2} onChange={(e) => setAmount2(e.target.value)} />
//         <input type="number" placeholder="Amount 3" value={amount3} onChange={(e) => setAmount3(e.target.value)} />
//         <button onClick={multisendTokens}>Multisend</button>

//         <h2>Pause/Unpause Contract</h2>
//         <button onClick={pauseContract}>Pause Contract</button>
//         <button onClick={unpauseContract}>Unpause Contract</button>
//       </header>
//     </div>
//   );
// }

// export default App;
