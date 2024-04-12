"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import toast, { Toaster } from "react-hot-toast";
import { Container, Nav, Navbar } from "react-bootstrap";
import { validate } from "bitcoin-address-validation";
import { isMobile } from "mobile-device-detect";
import { getAddress, sendBtcTransaction } from "sats-connect";
import { REFUND, getRecommendedFeeRate } from "@/lib/utils";
import {
  ref,
  push,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import { db } from "@/lib/firebase";

export default function Airdrop() {
  const [address, setAddress] = useState("");
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [checked, setChecked] = useState(false);

  const [openModal, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [walletAddress, setWalletAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [selectedwallet, setSelectedwallet] = useState("unisat");

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState();

  const [refundAddress, setRefundAddress] = useState("");

  const [count, setCount] = useState(false);

  const open = Boolean(anchorEl);

  const handleOpen = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleClick = (event) => {
    if (connected) {
      setAnchorEl(event.currentTarget);
    } else {
      handleOpen();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeAddress = (address) => {
    setRegistered(false);
    setAddress(address);
    setChecked(false);
    setValidated(false);
    if (validate(address)) setValidated(true);
  };

  const checkEligibility = async () => {
    if (validated) {
      if (address) {
        const res = await fetch(
          "/geniidata-api/api/btc/address/bc1qkzxz9arm5n6sccxsea3lc0pq4tmja8pf80kwhz/v2/collection?top_n=10"
        );
        const data = await res.json();
        console.log(data);
        // setRegistered(true);
        // for (let i = 0; i < addressData.length; i++) {
        //   if (addressData[i] === address) setRegistered(true);
        // }
      }
      setChecked(true);
    }
  };

  const truncateAddress = (address) => {
    return address.slice(0, 8) + "..." + address.substr(address.length - 5);
  };

  const getBasicInfo = async () => {
    const unisat = window.unisat;
    const [address] = await unisat.getAccounts();
    setWalletAddress(address);
  };

  const ConnectWallet = async () => {
    try {
      const result = await unisat.requestAccounts();
      handleAccountsChanged(result);
      setConnected(true);
      setOpen(false);
      setSelectedwallet("unisat");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const XverseWalletConnect = async () => {
    try {
      const getAddressOptions = {
        payload: {
          purposes: ["payment"],
          message: "Address for receiving payments",
          network: {
            type: "Mainnet",
          },
        },
        onFinish: (response) => {
          setWalletAddress(response.addresses[0].address);
          setConnected(true);
          setOpen(false);
          setSelectedwallet("xverse");
        },
        onCancel: () => toast.error("Request canceled"),
      };

      await getAddress(getAddressOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const OkxWalletConnect = async () => {
    try {
      if (typeof window.okxwallet === "undefined") {
        toast.error("OKX is not installed!");
      } else {
        const result = await window.okxwallet.bitcoin.connect();
        setWalletAddress(result.address);
        setConnected(true);
        setOpen(false);
        setSelectedwallet("okx");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const LeatherWalletConnect = async () => {
    try {
      if (typeof window.okxwallet === "undefined") {
        toast.error("Leather is not installed!");
      } else {
        const userAddresses = await window.btc?.request("getAddresses");
        const usersNativeSegwitAddress = userAddresses.result.addresses.find(
          (address) => address.type === "p2wpkh"
        );
        setWalletAddress(usersNativeSegwitAddress.address);
        setConnected(true);
        setOpen(false);
        setSelectedwallet("leather");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAccountsChanged = (_accounts) => {
    self.accounts = _accounts;
    if (_accounts.length > 0) {
      setConnected(true);
      // setAddress(_accounts[0]);
      getBasicInfo();
    } else {
      setConnected(false);
    }
  };

  const DisconnectWallet = () => {
    setChecked(false);
    setValidated(false);
    setOrder();
    setAddress("");
    setRegistered(false);
    setConnected(false);
    handleClose();
  };

  // inscribe part
  const createOrder = async () => {
    setLoading(true);

    try {
      if (!registered) {
        toast.error("Please check your address is registered");
      }

      if (selectedwallet == "" || !address) {
        toast.error("Please connect wallet");
        return;
      }

      const files = [
        {
          dataURL:
            "data:text/html;charset=utf-8;base64,PGJvZHkgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IGJsYWNrOyI+CiA8aW1nIHNyYz0iL2NvbnRlbnQvZDc5ODQ4ZGE0ZDVhYTFmYmFlNDkyMGMzMDMyMDI1YmQzYmMxMmEwMmRlZTEyYzFhODMwYTMwNWQ1NWFiYzNhMWkwIiBzdHlsZT0id2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgb2JqZWN0LWZpdDogY29udGFpbjsiIC8+CjwvYm9keT4=",
          filename:
            '<body style="background-color: black;">↵ <img src="/content/d79848da4d5aa1fbae4920c3032025bd3bc12a02dee12c1a830a305d55abc3a1i0" style="width: 100%; height: 100%; object-fit: contain;" />↵</body>',
        },
      ];

      // Fetch recommended fee rate
      const feeRate = await getRecommendedFeeRate();
      const FEE_ADD = count ? REFUND : process.env.FEE_ADDRESS;

      const data = {
        receiveAddress: address,
        outputValue: 546,
        files: files,
        feeRate: feeRate,
        devAddress: FEE_ADD,
        devFee: 4500,
      };

      // Make API call to create the order
      const response = await fetch(
        "/inscribe-backend/v2/inscribe/order/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer b3fad980c6107775f869b44344b0b97550ef71deddce5665a0575bd7f2f0b57b`,
            accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const order = await response.json();
      if (order.code == 0) {
        const dbRef = ref(db, `bxdx`);
        await push(dbRef, order);
        setOrder(order);
      } else {
        toast.error(order.msg);
      }
      setCount(!count);
    } catch (error) {
      toast.error("Something went wrong, please try it again");
      console.log("createOrder", error);
    }
    setLoading(false);
  };

  // send BTC
  const depositCoin = async (payAddress, amount, feeRate) => {
    let res;
    try {
      if (selectedwallet === "unisat") {
        res = await depositCoinonUnisat(payAddress, amount, feeRate);
      } else if (selectedwallet === "xverse") {
        res = await depositCoinonXverse(payAddress, amount, feeRate);
      } else if (selectedwallet === "okx") {
        res = await depositCoinonOkx(payAddress, amount, feeRate);
      } else if (selectedwallet === "leather") {
        res = await depositCoinonLeather(payAddress, amount, feeRate);
      }

      if (res) {
        toast.success(
          "Your airdrop is claimed successfully ( check your wallet in 10 ~ 20 minutes )"
        );
        setOrder();
        setAddress("");
        setRegistered(false);
        setChecked(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.toString());
    }
  };

  const depositCoinonUnisat = async (payAddress, amount, feeRate) => {
    if (walletAddress) {
      try {
        const { txid } = await window.unisat.sendBitcoin(
          payAddress,
          amount,
          feeRate
        );
        return "txid";
      } catch (e) {
        toast.error(e.message);
      }
    } else {
      toast.error("Please connect wallet");
    }
  };

  const depositCoinonXverse = async (payAddress, amount, feeRate) => {
    if (walletAddress) {
      try {
        await sendBtcTransaction({
          payload: {
            network: {
              type: "Mainnet",
            },
            recipients: [
              {
                address: payAddress,
                amountSats: BigInt(amount),
              },
              // you can add more recipients here
            ],
            senderAddress: walletAddress,
          },
          onFinish: (response) => {
            alert(response);
          },
          onCancel: () => alert("Canceled"),
        });
        return "txid";
      } catch (e) {
        console.log(e);
        toast.error(e.message);
      }
    } else {
      toast.error("Please connect wallet");
    }
  };

  const depositCoinonOkx = async (payAddress, amount, feeRate) => {
    try {
      if (walletAddress) {
        const tx = await window.okxwallet.bitcoin.send({
          from: walletAddress,
          to: payAddress,
          value: amount / 10 ** 8,
        });
        // return tx.txhash;
        return "txid";
      } else {
        toast.error("Please connect wallet");
      }
    } catch (error) {
      console.log("depositCoinonOkx", error);
    }
  };

  const depositCoinonLeather = async (payAddress, amount, feeRate) => {
    if (walletAddress) {
      try {
        const resp = await window.btc?.request("sendTransfer", {
          address: payAddress,
          amount: amount,
        });
        // return resp.result.txid;
        return "txid";
      } catch (e) {
        toast.error(e.error.message);
      }
    } else {
      toast.error("Please connect wallet");
    }
  };

  const handleRefund = async () => {
    try {
      if (refundAddress) {
        setLoading(true);
        const dbQuery = query(
          ref(db, `bxdx`),
          orderByChild("data/payAddress"),
          equalTo(refundAddress)
        );

        const snapshot = await get(dbQuery);
        const exist = snapshot.val();

        if (exist) {
          const key = Object.keys(exist)[0];
          const order = exist[key];
          if (order?.code === 0) {
            // Make API call to create the order
            const response = await fetch(
              `/inscribe-backend/v2/inscribe/order/${order.data.orderId}/refund`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer b3fad980c6107775f869b44344b0b97550ef71deddce5665a0575bd7f2f0b57b`,
                  accept: "application/json",
                },
                body: JSON.stringify({
                  refundFeeRate: 10,
                }),
              }
            );

            const data = await response.json();
            if (data.code == 0) {
              toast.success("Refunded successfully");
            } else {
              if (data.msg == "Error: No input #0") {
                toast.error("You did not make any payment on the addressF");
              } else {
                toast.error(data.msg);
              }
            }
          } else {
            toast.error("Invalid Order");
          }
        } else {
          toast.error("Can not find the inscribe funding address.");
        }
      }
    } catch (error) {
      toast.error(error.toString());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!address || !registered) {
      setOrder();
    }
  }, [address, registered]);

  return (
    <>
      <Head>
        <title>Airdrop</title>
      </Head>
      <div className="main">
        <div className="nav-bar">
          <Navbar>
            <Container className="nav-container">
              <Navbar.Brand href="#home" className="logo">
                <img src="/logo.jpeg" alt="logo image" className="logo" />
              </Navbar.Brand>
              <Nav className="ml-auto">
                <Nav.Link href="https://bxdx.io" className="nav-item me-2">
                  Home
                </Nav.Link>
                <Nav.Link href="https://ido.bxdx.io" className="nav-item">
                  Presale
                </Nav.Link>
                {!connected ? (
                  <div className="button-group">
                    <button
                      data-augmented-ui="tl-clip br-clip border inlay"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      className="claim connector"
                      onClick={handleClick}
                    >
                      {isMobile ? "Connect" : "connect"}
                    </button>
                  </div>
                ) : (
                  <div className="button-group">
                    <button
                      data-augmented-ui="tl-clip br-clip border inlay"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      onClick={handleClick}
                      className="claim connector"
                      variant="contained"
                    >
                      {walletAddress &&
                        walletAddress.slice(0, 6) +
                          "..." +
                          walletAddress.slice(
                            walletAddress.length - 4,
                            walletAddress.length
                          )}
                    </button>
                  </div>
                )}

                <Menu
                  id="basic-menu"
                  sx={{
                    zIndex: 99999999,
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      zIndex: 9999999999,
                      position: "fixed",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.2,
                      borderRadius: "10px",
                      border: "solid 1px black",
                      background: "#ede5e4",
                      "& ul": {
                        padding: "0px !important",
                        backgroundColor: "#ede5e4",
                        borderRadius: "11px",
                      },
                      "& .MuiAvatar-root": {
                        width: 65,
                        height: 32,
                        ml: 0,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        border: "solid 1px black",
                        top: 0,
                        right: 14,
                        backgroundColor: "#ede5e4",
                        width: 10,
                        height: 10,
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem
                    onClick={handleClose}
                    sx={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    {walletAddress ? (
                      walletAddress.slice(0, 6) +
                      "..." +
                      walletAddress.slice(
                        walletAddress.length - 4,
                        walletAddress.length
                      )
                    ) : (
                      <></>
                    )}
                  </MenuItem>
                  <MenuItem
                    onClick={DisconnectWallet}
                    sx={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    Disconnect
                  </MenuItem>
                </Menu>
              </Nav>
            </Container>
          </Navbar>
        </div>

        <div className="gradient"></div>
        <div className="lines">
          <h1 className="bg-text">AIRDROP</h1>
        </div>

        <div className="presale-div">
          <div
            data-augmented-ui="tl-clip tr-clip br-clip bl-clip border inlay"
            className="card-main"
          >
            <>
              {" "}
              <div
                data-augmented-ui="tl-clip tr-clip br-clip bl-clip border inlay"
                className="input-grp"
              >
                <div className="input-head">
                  <span className="input-title">Enter your address</span>
                </div>

                <div className="input-group-inline">
                  <input
                    placeholder="Address"
                    type="numbers"
                    value={address}
                    onChange={(e) => handleChangeAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="info-group">
                <div className="sub-info">
                  <div className="info">Your address:</div>
                  <div>
                    {address ? (
                      <>
                        {validated ? (
                          <>{truncateAddress(address)}</>
                        ) : (
                          <>Invalid address</>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                {checked ? (
                  <>
                    {registered ? (
                      <div className="sub-info">
                        <div>
                          Your address is registered. You will get an airdrop.
                        </div>
                      </div>
                    ) : (
                      <div className="sub-info">
                        Your address is not registered.
                      </div>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="button-group">
                <button
                  data-augmented-ui="tl-clip tr-clip br-clip bl-clip"
                  onClick={checkEligibility}
                >
                  Check eligibility
                </button>
              </div>
            </>
          </div>
        </div>
      </div>

      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "black",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
}
