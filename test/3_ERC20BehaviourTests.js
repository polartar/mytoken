const {
  BN,
  constants,
  expectEvent,
  expectRevert,
} = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { ZERO_ADDRESS } = constants;

const Tokenize = artifacts.require("./Tokenize.sol");

contract("ERC20 functionality works", function (accounts) {
  const [
    initialHolder,
    recipient,
    anotherAccount,
    dummyVerificationList,
    contractOwner,
  ] = accounts;
  const name = "Burj Khalifa";
  const symbol = "BKH";
  const initialSupply = new BN(10000);
  const decimal = 18;
  const tokenURI = "QmPXME1oRtoT627YKaDPDQ3PwA8tdP9rWuAAweLzqSwAWT";

  const tokenizerVerificationList = false;
  const ownerVerificationList = false;

  const feesPercentage = new BN(2);
  const hundreadPercentage = new BN(100);
  beforeEach(async function () {
    this.token = await Tokenize.new(
      name,
      symbol,
      decimal,
      initialHolder,
      initialSupply,
      tokenURI,
      tokenizerVerificationList,
      dummyVerificationList,
      ownerVerificationList,
      contractOwner
    );
  });
  it("has a name", async function () {
    expect(await this.token.name()).to.equal(name);
  });
  it("has a symbol", async function () {
    expect(await this.token.symbol()).to.equal(symbol);
  });

  it("has 18 decimals", async function () {
    expect(await this.token.decimals()).to.be.bignumber.equal("18");
  });
  describe("total supply", function () {
    it("returns the total amount of tokens", async function () {
      expect(await this.token.totalSupply()).to.be.bignumber.equal(
        initialSupply
      );
    });
  });

  describe("balanceOf", function () {
    describe("when the requested account has no tokens", function () {
      it("returns zero", async function () {
        expect(
          await this.token.balanceOf(anotherAccount)
        ).to.be.bignumber.equal("0");
      });
    });

    describe("when the requested account has some tokens", function () {
      it("returns the total amount of tokens", async function () {
        expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(
          initialSupply
        );
      });
    });
  });
  describe("transfer", function () {
    shouldBehaveLikeERC20Transfer(
      initialHolder,
      recipient,
      initialSupply,
      function (from, to, value) {
        return this.token.transfer(to, value, { from });
      }
    );
  });
  describe("transfer from", function () {
    const spender = recipient;

    describe("when the token owner is not the zero address", function () {
      const tokenOwner = initialHolder;

      describe("when the recipient is not the zero address", function () {
        const to = anotherAccount;

        describe("when the spender has enough approved balance", function () {
          var receipet;
          beforeEach(async function () {
            receipet = await this.token.approve(spender, initialSupply, {
              from: initialHolder,
            });
          });

          describe("when the token owner has enough balance", function () {
            const amount = initialSupply;

            it("transfers the requested amount", async function () {
              await this.token.transferFrom(tokenOwner, to, amount, {
                from: spender,
              });

              let fees = amount.mul(feesPercentage).div(hundreadPercentage);

              expect(
                await this.token.balanceOf(tokenOwner)
              ).to.be.bignumber.equal("0");

              expect(await this.token.balanceOf(to)).to.be.bignumber.equal(
                amount.sub(fees)
              );
            });

            it("decreases the spender allowance", async function () {
              await this.token.transferFrom(tokenOwner, to, amount, {
                from: spender,
              });

              expect(
                await this.token.allowance(tokenOwner, spender)
              ).to.be.bignumber.equal("0");
            });

            it("emits a transfer event", async function () {
              const { logs } = await this.token.transferFrom(
                tokenOwner,
                to,
                amount,
                { from: spender }
              );
              let fees = amount.mul(feesPercentage).div(hundreadPercentage);
              expectEvent.inLogs(logs, "Transfer", {
                from: tokenOwner,
                to: to,
                value: amount.sub(fees),
              });
            });

            it("emits an approval event", async function () {
              expectEvent.inLogs(receipet.logs, "Approval", {
                owner: tokenOwner,
                spender: spender,
                value: await this.token.allowance(tokenOwner, spender),
              });
            });
          });

          describe("when the token owner does not have enough balance", function () {
            const amount = initialSupply.addn(1);

            it("reverts", async function () {
              await expectRevert.assertion(
                this.token.transferFrom(tokenOwner, to, amount, {
                  from: spender,
                })
              );
            });
          });
        });

        describe("when the spender does not have enough approved balance", function () {
          beforeEach(async function () {
            await this.token.approve(spender, initialSupply.subn(1), {
              from: tokenOwner,
            });
          });

          describe("when the token owner has enough balance", function () {
            const amount = initialSupply;

            it("reverts", async function () {
              await expectRevert.assertion(
                this.token.transferFrom(tokenOwner, to, amount, {
                  from: spender,
                })
              );
            });
          });

          describe("when the token owner does not have enough balance", function () {
            const amount = initialSupply.addn(1);

            it("reverts", async function () {
              await expectRevert.assertion(
                this.token.transferFrom(tokenOwner, to, amount, {
                  from: spender,
                })
              );
            });
          });
        });
      });

      describe("when the recipient is the zero address", function () {
        const amount = initialSupply;
        const to = ZERO_ADDRESS;

        beforeEach(async function () {
          await this.token.approve(spender, amount, { from: tokenOwner });
        });

        it("reverts", async function () {
          await expectRevert(
            this.token.transferFrom(tokenOwner, to, amount, { from: spender }),
            `ERC20: transfer to the zero address`
          );
        });
      });
    });

    describe("when the token owner is the zero address", function () {
      const amount = 0;
      const tokenOwner = ZERO_ADDRESS;
      const to = recipient;

      it("reverts", async function () {
        await expectRevert(
          this.token.transferFrom(tokenOwner, to, amount, { from: spender }),
          `ERC20: transfer from the zero address`
        );
      });
    });
  });
  describe("approve", function () {
    shouldBehaveLikeERC20Approve(
      initialHolder,
      recipient,
      initialSupply,
      function (owner, spender, amount) {
        return this.token.approve(spender, amount, { from: owner });
      }
    );
  });

  function shouldBehaveLikeERC20Transfer(from, to, balance, transfer) {
    describe("when the recipient is not the zero address", function () {
      describe("when the sender does not have enough balance", function () {
        const amount = balance.addn(1);

        it("reverts", async function () {
          //Becuase we assert that underflow does not happen instead of throwing an error
          await expectRevert.assertion(transfer.call(this, from, to, amount));
        });
      });

      describe("when the sender transfers all balance", function () {
        const amount = balance;

        it("transfers the requested amount", async function () {
          await transfer.call(this, from, to, amount);

          expect(await this.token.balanceOf(from)).to.be.bignumber.equal("0");
          //Because of transfer fees of 2%
          //We need to do it like
          let fees = amount.mul(feesPercentage).div(hundreadPercentage);
          expect(await this.token.balanceOf(to)).to.be.bignumber.equal(
            amount.sub(fees)
          );
        });

        it("emits a transfer event", async function () {
          const { logs } = await transfer.call(this, from, to, amount);
          let fees = amount.mul(feesPercentage).div(hundreadPercentage);
          expectEvent.inLogs(logs, "Transfer", {
            from,
            to,
            value: amount.sub(fees),
          });
        });
      });

      describe("when the sender transfers zero tokens", function () {
        const amount = new BN("0");

        it("transfers the requested amount", async function () {
          await transfer.call(this, from, to, amount);

          expect(await this.token.balanceOf(from)).to.be.bignumber.equal(
            balance
          );

          expect(await this.token.balanceOf(to)).to.be.bignumber.equal("0");
        });

        it("emits a transfer event", async function () {
          const { logs } = await transfer.call(this, from, to, amount);
          let fees = amount.mul(feesPercentage).div(hundreadPercentage);
          expectEvent.inLogs(logs, "Transfer", {
            from,
            to,
            value: amount.sub(fees),
          });
        });
      });
    });

    describe("when the recipient is the zero address", function () {
      it("reverts", async function () {
        await expectRevert(
          transfer.call(this, from, ZERO_ADDRESS, balance),
          `ERC20: transfer to the zero address`
        );
      });
    });
  }
  function shouldBehaveLikeERC20Approve(owner, spender, supply, approve) {
    describe("when the spender is not the zero address", function () {
      describe("when the sender has enough balance", function () {
        const amount = supply;

        it("emits an approval event", async function () {
          const { logs } = await approve.call(this, owner, spender, amount);

          expectEvent.inLogs(logs, "Approval", {
            owner: owner,
            spender: spender,
            value: amount,
          });
        });

        describe("when there was no approved amount before", function () {
          it("approves the requested amount", async function () {
            await approve.call(this, owner, spender, amount);

            expect(
              await this.token.allowance(owner, spender)
            ).to.be.bignumber.equal(amount);
          });
        });

        describe("when the spender had an approved amount", function () {
          beforeEach(async function () {
            await approve.call(this, owner, spender, new BN(1));
          });

          it("approves the requested amount and replaces the previous one", async function () {
            // To change the approve amount you first have to reduce the addresses`
            //  allowance to zero by calling `approve(_spender, 0)` if it is not
            //  already 0 to mitigate the race condition described here:
            //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

            await approve.call(this, owner, spender, 0);
            await approve.call(this, owner, spender, amount);

            expect(
              await this.token.allowance(owner, spender)
            ).to.be.bignumber.equal(amount);
          });
        });
      });

      describe("when the sender does not have enough balance", function () {
        const amount = supply.addn(1);

        it("emits an approval event", async function () {
          const { logs } = await approve.call(this, owner, spender, amount);

          expectEvent.inLogs(logs, "Approval", {
            owner: owner,
            spender: spender,
            value: amount,
          });
        });

        describe("when there was no approved amount before", function () {
          it("approves the requested amount", async function () {
            await approve.call(this, owner, spender, amount);

            expect(
              await this.token.allowance(owner, spender)
            ).to.be.bignumber.equal(amount);
          });
        });

        describe("when the spender had an approved amount", function () {
          beforeEach(async function () {
            await approve.call(this, owner, spender, new BN(1));
          });

          it("approves the requested amount and replaces the previous one", async function () {
            // To change the approve amount you first have to reduce the addresses`
            //  allowance to zero by calling `approve(_spender, 0)` if it is not
            //  already 0 to mitigate the race condition described here:
            //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

            await approve.call(this, owner, spender, 0);
            await approve.call(this, owner, spender, amount);

            expect(
              await this.token.allowance(owner, spender)
            ).to.be.bignumber.equal(amount);
          });
        });
      });
    });

    describe("when the spender is the zero address", function () {
      it("reverts", async function () {
        await expectRevert(
          approve.call(this, owner, ZERO_ADDRESS, supply),
          `ERC20: approve to the zero address`
        );
      });
    });
  }
});
