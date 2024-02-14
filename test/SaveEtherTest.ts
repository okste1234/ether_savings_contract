import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Savings", function () {
      async function deploySavingsContractFixture() {
        const [owner, otherAccount] = await ethers.getSigners();
        const SaveEther = await ethers.getContractFactory("SaveEther");
        const {deposit, withdraw, checkSavings, sendOutSaving, checkContractBal} = await SaveEther.deploy();
        return { deposit, withdraw, checkSavings, sendOutSaving, checkContractBal, owner, otherAccount };
      }

  describe("deposit, withdraw, checkSavings, sendOutSaving, and checkContractBal", function () {
    

      describe("deposit, withdraw, checkSavings, sendOutSaving, and checkContractBal", function () {
        it("Should be able to deposit", async function () {
           const { deposit, checkContractBal } = await loadFixture(deploySavingsContractFixture);
          // deposit 1wei
            const depositTx = await deposit({value:1});
            const balance = await checkContractBal()
            expect(balance).to.equal(1);
        });

        it("Should revert when trying to deposit zero value", async function () {
          const { deposit } = await loadFixture(
            deploySavingsContractFixture
          );

          // Try to deposit zero ETH
          await expect(
            deposit({
              value: 0,
            })).to.be.revertedWith("can't save zero value");
        });
          it("Should be able to withdraw all and render savings balance zero", async function () {
           const { deposit, withdraw } = await loadFixture(deploySavingsContractFixture);
          // Send 1 ETH
              const depositTx = await deposit({ value: ethers.parseEther("1") });
            //   withdraw all ETH
            const balance = await withdraw()
            expect(balance.value).to.equal(0);
          });
          it("Should revert when trying to withdraw when you have zero in savings", async function () {
           const { withdraw } = await loadFixture(deploySavingsContractFixture);
            //   withdraw all ETH
            const withdrawing = withdraw()
            await expect(withdrawing).to.be.revertedWith("you don't have any savings");
          });
          
          it("Should send out savings suceefully, and check receivers balance", async function () {
            const { sendOutSaving, checkSavings, checkContractBal, otherAccount, deposit } = await loadFixture(deploySavingsContractFixture);
            await deposit({ value: ethers.parseEther("2") })
            
            const receiverInitialBal = await ethers.provider.getBalance(otherAccount.address);

            await sendOutSaving(otherAccount.address, ethers.parseEther("1"))         
            const checkRemainBal = await checkContractBal()
            const receiverUpdatedBalance = await ethers.provider.getBalance(otherAccount.address);
            // const receiverBal = await checkSavings(otherAccount.address)
              
            expect(checkRemainBal).to.equal(ethers.parseEther("1"));

            expect(receiverUpdatedBalance).to.be.gt(receiverInitialBal);
    });
          });
        
        it("Should revert when trying to send beyond your savings ", async function () {
              const { sendOutSaving, otherAccount, deposit } = await loadFixture(deploySavingsContractFixture);
            await deposit({ value: 10 })
            const errorSending = sendOutSaving(otherAccount.address, 13)
            await expect(errorSending).to.be.revertedWith("you're above your balance limit");  
        });
      });
    });
