"use client";

import React, { useState } from "react";
import Head from "next/head";
import { Container, Nav, Navbar } from "react-bootstrap";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
// import axios from 'axios';

export default function Airdrop() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const { width, height } = useWindowSize();

  const handleChangeAddress = (address) => {
    if (!address) {
      setChecked(false);
      setAmount(0);
    }
    setAddress(address);
  };

  // Helper function to sleep for a specified duration
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchAllData() {
    // const baseUrl = "/tracker/priapi/v1/nft/personal/owned/collection-list";
    // let allData = [];
    // let pageNo = 1;
    // let pageSize = 20; // Define page size as constant, since it's reused

    // while (true) {
    //   const tParam = Date.now();
    //   const url = `${baseUrl}?t=${tParam}`;

    //   try {
    //     console.log(
    //       address,
    //       JSON.stringify({
    //         address: address,
    //         chain: 0,
    //         pageNo: pageNo,
    //         pageSize: pageSize,
    //         hiddenStatus: "",
    //         projectCertificated: false,
    //       })
    //     );

    //     const result = await axios.post(url, {
    //       address: address,
    //       chain: 0,
    //       pageNo: pageNo,
    //       pageSize: pageSize,
    //       hiddenStatus: "",
    //       projectCertificated: false,
    //     });
    //     allData = allData.concat(result.data.list);
    //     console.log(allData);

    //     // Using the total and current fetched count to determine if there are more pages
    //     const fetchedItemsCount = pageNo * pageSize;
    //     if (fetchedItemsCount >= result.data.total) {
    //       // No more data to fetch, break out of the loop
    //       break;
    //     }

    //     pageNo++;

    //     // Sleep only if there is more data to fetch
    //     await sleep(200);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //     break; // Exit if there is an error
    //   }
    // }

    // console.log(`Fetched ${allData.length} items.`);
    // return allData;
  }

  const checkEligibility = async () => {
    console.log("address:", address);
    setChecked(false);
    if (!address) {
      setAmount(0);
      return;
    }
    console.log("address:", address);

    setChecking(true);
    console.log("address:", address);

    try {
      const data = await fetchAllData(address);
      const eligibleCollection = data.find(
        (collection) => collection.collectionName === "bitx-runes"
      );
      console.log(eligibleCollection);

      setAmount(eligibleCollection ? eligibleCollection.count : 0);
      setChecking(false);
      setChecked(true);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const truncateAddress = (address) => {
    return address.slice(0, 8) + "..." + address.substr(address.length - 5);
  };

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
                  <div
                    className={`${amount ? "text-green-500" : "text-white"}`}
                  >
                    {address ? <>{truncateAddress(address)}</> : <></>}
                  </div>
                </div>
                {/* {checked && (
                  <> */}
                {amount ? (
                  <>
                    <div className="sub-info">
                      <div className="info">Bitx Runes:</div>
                      <div>{amount}</div>
                    </div>
                    <div className="sub-info">
                      <div className="info">Claimable $BITX:</div>
                      <div>{amount * 500} </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sub-info">
                      <div>Your address is not registered.</div>
                    </div>
                  </>
                )}
                {/* </>
                )} */}
              </div>
              <div className="button-group">
                <button
                  data-augmented-ui="tl-clip tr-clip br-clip bl-clip"
                  onClick={() => checkEligibility()}
                >
                  {checking ? "Checking..." : "Check eligibility"}
                </button>
              </div>
            </>
          </div>
        </div>
      </div>

      {checked && amount && <Confetti width={width} height={height} />}
    </>
  );
}
