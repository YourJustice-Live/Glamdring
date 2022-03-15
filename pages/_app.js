import { Web3Provider } from "contexts/web3";
import 'styles/globals.scss';

function App({ Component, pageProps }) {

  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  )

}

export default App;
