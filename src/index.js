import { IExec, utils } from "iexec";

const networkOutput = document.getElementById("network");
const addressOutput = document.getElementById("address");
const rlcWalletOutput = document.getElementById("rlc-wallet");
const nativeWalletOutput = document.getElementById("native-wallet");
const accountOutput = document.getElementById("account");
const accountDepositInput = document.getElementById("account-deposit-input");
const accountDepositButton = document.getElementById("account-deposit-button");
const accountDepositError = document.getElementById("account-deposit-error");
const accountWithdrawInput = document.getElementById("account-withdraw-input");
const accountWithdrawButton = document.getElementById(
  "account-withdraw-button"
);
const accountWithdrawError = document.getElementById("account-withdraw-error");
const appsShowInput = document.getElementById("apps-address-input");
const appsShowButton = document.getElementById("apps-show-button");
const appsShowError = document.getElementById("apps-show-error");
const appShowOutput = document.getElementById("apps-details-output");
const appsCountButton = document.getElementById("apps-count-button");
const appsCountError = document.getElementById("apps-count-error");
const appsCountOutput = document.getElementById("apps-count-output");
const appsIndexInput = document.getElementById("apps-index-input");
const appsShowIndexButton = document.getElementById("apps-showindex-button");
const appsShowIndexError = document.getElementById("apps-showindex-error");
const appsShowIndexOutput = document.getElementById("apps-showindex-output");
const appsDeployNameInput = document.getElementById("apps-deployname-input");
const appsDeployMultiaddrInput = document.getElementById(
  "apps-deploymultiaddr-input"
);
const appsDeployChecksumInput = document.getElementById(
  "apps-deploychecksum-input"
);
const appsDeployButton = document.getElementById("apps-deploy-button");
const appsDeployError = document.getElementById("apps-deploy-error");
const appsDeployOutput = document.getElementById("apps-deploy-output");

const sellAppAddressInput = document.getElementById("sell-appaddress-input");
const sellAppPriceInput = document.getElementById("sell-appprice-input");
const sellAppVolumeInput = document.getElementById("sell-volume-input");
const sellPublishButton = document.getElementById("sell-publish-button");
const sellPublishError = document.getElementById("sell-publish-error");
const sellPublishOutput = document.getElementById("sell-publish-output");
const sellUnpublishOrderhashInput = document.getElementById(
  "sell-unpublishhash-input"
);
const sellUnpublishButton = document.getElementById("sell-unpublish-button");
const sellUnpublishError = document.getElementById("sell-unpublish-error");
const sellUnpublishOutput = document.getElementById("sell-unpublish-output");
const sellCancelOrderhashInput = document.getElementById(
  "sell-cancelhash-input"
);
const sellCancelButton = document.getElementById("sell-cancel-button");
const sellCancelError = document.getElementById("sell-cancel-error");
const sellCancelOutput = document.getElementById("sell-cancel-output");

const orderbookAppAddressInput = document.getElementById(
  "orderbook-appaddress-input"
);
const orderbookShowButton = document.getElementById("orderbook-show-button");
const orderbookShowError = document.getElementById("orderbook-show-error");
const orderbookShowOutput = document.getElementById("orderbook-show-output");

const refreshUser = (iexec) => async () => {
  const userAddress = await iexec.wallet.getAddress();
  const [wallet, account] = await Promise.all([
    iexec.wallet.checkBalances(userAddress),
    iexec.account.checkBalance(userAddress),
  ]);
  const nativeWalletText = `${utils.formatEth(wallet.wei)} ether`;
  const rlcWalletText = `${utils.formatRLC(wallet.nRLC)} RLC`;
  addressOutput.innerText = userAddress;
  rlcWalletOutput.innerHTML = rlcWalletText;
  nativeWalletOutput.innerHTML = nativeWalletText;
  accountOutput.innerText = `${utils.formatRLC(
    account.stake
  )} RLC (+ ${utils.formatRLC(account.locked)} RLC locked)`;
};

const deposit = (iexec) => async () => {
  try {
    accountDepositButton.disabled = true;
    accountDepositError.innerText = "";
    const amount = accountDepositInput.value;
    await iexec.account.deposit(amount);
    refreshUser(iexec)();
  } catch (error) {
    accountDepositError.innerText = error;
  } finally {
    accountDepositButton.disabled = false;
  }
};

const withdraw = (iexec) => async () => {
  try {
    accountWithdrawButton.disabled = true;
    accountWithdrawError.innerText = "";
    const amount = accountWithdrawInput.value;
    await iexec.account.withdraw(amount);
    refreshUser(iexec)();
  } catch (error) {
    accountWithdrawError.innerText = error;
  } finally {
    accountWithdrawButton.disabled = false;
  }
};

const showApp = (iexec) => async () => {
  try {
    appsShowButton.disabled = true;
    appsShowError.innerText = "";
    appShowOutput.innerText = "";
    const appAddress = appsShowInput.value;
    const res = await iexec.app.showApp(appAddress);
    appShowOutput.innerText = JSON.stringify(res, null, 2);
  } catch (error) {
    appsShowError.innerText = error;
  } finally {
    appsShowButton.disabled = false;
  }
};

const showAppByIndex = (iexec) => async () => {
  try {
    appsShowIndexButton.disabled = true;
    appsShowIndexError.innerText = "";
    appsShowIndexOutput.innerText = "";
    const appIndex = appsIndexInput.value;
    const res = await iexec.app.showUserApp(
      appIndex,
      await iexec.wallet.getAddress()
    );
    appsShowIndexOutput.innerText = JSON.stringify(res, null, 2);
  } catch (error) {
    appsShowIndexError.innerText = error;
  } finally {
    appsShowIndexButton.disabled = false;
  }
};

const countApps = (iexec) => async () => {
  try {
    appsCountButton.disabled = true;
    appsCountError.innerText = "";
    appsCountOutput.innerText = "";
    const count = await iexec.app.countUserApps(
      await iexec.wallet.getAddress()
    );
    appsCountOutput.innerText = `total deployed apps ${count}`;
  } catch (error) {
    appsCountError.innerText = error;
  } finally {
    appsCountButton.disabled = false;
  }
};

const deployApp = (iexec) => async () => {
  try {
    appsDeployButton.disabled = true;
    appsDeployError.innerText = "";
    appsDeployOutput.innerText = "";
    const owner = await iexec.wallet.getAddress();
    const name = appsDeployNameInput.value;
    const type = "DOCKER"; // only "DOCKER" is supported for now
    const multiaddr = appsDeployMultiaddrInput.value;
    const checksum = appsDeployChecksumInput.value;
    const mrenclave = ""; // used for Scone apps
    const { address } = await iexec.app.deployApp({
      owner,
      name,
      type,
      multiaddr,
      checksum,
      mrenclave,
    });
    appsDeployOutput.innerText = `App deployed at address ${address}`;
    appsShowInput.value = address;
    sellAppAddressInput.value = address;
    orderbookAppAddressInput.value = address;
    refreshUser(iexec)();
  } catch (error) {
    appsDeployError.innerText = error;
  } finally {
    appsDeployButton.disabled = false;
  }
};

const publishOrder = (iexec) => async () => {
  try {
    sellPublishButton.disabled = true;
    sellPublishError.innerText = "";
    sellPublishOutput.innerText = "";
    const app = sellAppAddressInput.value;
    const appprice = sellAppPriceInput.value;
    const volume = sellAppVolumeInput.value;
    const signedOrder = await iexec.order.signApporder(
      await iexec.order.createApporder({
        app,
        appprice,
        volume,
      })
    );
    const orderHash = await iexec.order.publishApporder(signedOrder);
    sellPublishOutput.innerText = `Order published with hash ${orderHash}`;
    sellUnpublishOrderhashInput.value = orderHash;
    sellCancelOrderhashInput.value = orderHash;
  } catch (error) {
    sellPublishError.innerText = error;
  } finally {
    sellPublishButton.disabled = false;
  }
};

const unpublishOrder = (iexec) => async () => {
  try {
    sellUnpublishButton.disabled = true;
    sellUnpublishError.innerText = "";
    sellUnpublishOutput.innerText = "";
    const orderHash = sellUnpublishOrderhashInput.value;
    const unpublishedOrderHash = await iexec.order.unpublishApporder(orderHash);
    sellUnpublishOutput.innerText = `Order with hash ${unpublishedOrderHash} is unpublished`;
  } catch (error) {
    sellUnpublishError.innerText = error;
  } finally {
    sellUnpublishButton.disabled = false;
  }
};

const cancelOrder = (iexec) => async () => {
  try {
    sellCancelButton.disabled = true;
    sellCancelError.innerText = "";
    sellCancelOutput.innerText = "";
    const orderHash = sellCancelOrderhashInput.value;
    const { order } = await iexec.orderbook.fetchApporder(orderHash);
    const { txHash } = await iexec.order.cancelApporder(order);
    sellCancelOutput.innerText = `Order canceled (tx: ${txHash})`;
    refreshUser(iexec)();
  } catch (error) {
    sellCancelError.innerText = error;
  } finally {
    sellCancelButton.disabled = false;
  }
};

const showOrderbook = (iexec) => async () => {
  try {
    orderbookShowButton.disabled = true;
    orderbookShowError.innerText = "";
    orderbookShowOutput.innerText = "";
    const appAddress = orderbookAppAddressInput.value;
    const res = await iexec.orderbook.fetchAppOrderbook(appAddress);
    orderbookShowOutput.innerText = JSON.stringify(res, null, 2);
  } catch (error) {
    orderbookShowError.innerText = error;
  } finally {
    orderbookShowButton.disabled = false;
  }
};

const init = async () => {
  try {
    let ethProvider;
    if (window.ethereum) {
      console.log("using default provider");
      ethProvider = window.ethereum;
      ethProvider.on("chainChanged", (_chainId) => window.location.reload());
      ethProvider.on("accountsChanged", (_accounts) =>
        window.location.reload()
      );
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x86",
            chainName: "iExec Sidechain",
            nativeCurrency: {
              name: "xRLC",
              symbol: "xRLC",
              decimals: 18,
            },
            rpcUrls: ["https://bellecour.iex.ec"],
            blockExplorerUrls: ["https://blockscout-bellecour.iex.ec"],
          },
        ],
      });
    } else {
      throw Error("No provider found");
    }

    const { result } = await new Promise((resolve, reject) =>
      ethProvider.sendAsync(
        {
          jsonrpc: "2.0",
          method: "net_version",
          params: [],
        },
        (err, res) => {
          if (!err) resolve(res);
          reject(Error(`Failed to get network version from provider: ${err}`));
        }
      )
    );
    const networkVersion = result;

    if (networkVersion !== "134") {
      const error = `Unsupported network ${networkVersion}, please switch to iExec Sidechain`;
      networkOutput.innerText = error;
      throw Error(error);
    }

    networkOutput.innerText = networkVersion;
    const iexec = new IExec({
      ethProvider,
    });

    await refreshUser(iexec)();

    accountDepositButton.addEventListener("click", deposit(iexec));
    accountWithdrawButton.addEventListener("click", withdraw(iexec));
    appsShowButton.addEventListener("click", showApp(iexec));
    appsCountButton.addEventListener("click", countApps(iexec));
    appsShowIndexButton.addEventListener("click", showAppByIndex(iexec));
    appsDeployButton.addEventListener("click", deployApp(iexec));
    sellPublishButton.addEventListener("click", publishOrder(iexec));
    sellUnpublishButton.addEventListener("click", unpublishOrder(iexec));
    sellCancelButton.addEventListener("click", cancelOrder(iexec));
    orderbookShowButton.addEventListener("click", showOrderbook(iexec));
    accountDepositButton.disabled = false;
    accountWithdrawButton.disabled = false;
    appsShowButton.disabled = false;
    appsCountButton.disabled = false;
    appsShowIndexButton.disabled = false;
    appsDeployButton.disabled = false;
    sellPublishButton.disabled = false;
    sellUnpublishButton.disabled = false;
    sellCancelButton.disabled = false;
    orderbookShowButton.disabled = false;
    console.log("initialized");
  } catch (e) {
    console.error(e.message);
  }
};

init();
