import useProfile from 'hooks/useProfile';

/**
 * Web worker to check if the account profile in the blockchain has been changed.
 */
addEventListener('message', (event) => {
  const { getProfile } = useProfile();
  const interval = 5 * 1000;

  let account = event.data.account;
  let accountInitProfile = event.data.accountProfile;
  let accountLoadedProfile = event.data.accountProfile;

  setInterval(async function () {
    // Post message if last update times of loaded profile is different
    if (
      accountInitProfile?.avatarNftMetadata?.lastUpdatedTime !==
      accountLoadedProfile?.avatarNftMetadata?.lastUpdatedTime
    ) {
      postMessage(accountLoadedProfile);
    }

    // Load profile from blockchain
    accountLoadedProfile = await getProfile(account);
  }, interval);
});
