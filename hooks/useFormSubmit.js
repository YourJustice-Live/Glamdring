import axios from 'axios';
import qs from 'qs';

/**
 * Hook for work with formsubmit.io.
 */
export default function useFormSubmit() {
  /**
   * Post form to formsubmit.io.
   *
   * @param {Array.<string>} recepients Emails.
   * @param {string} type Form type.
   * @param {string} account Account address.
   * @param {object} data Form data.
   */
  let submitForm = async function (recepients, type, account, data) {
    for (const recepient of recepients) {
      try {
        const postUrl = `https://formsubmit.co/ajax/${recepient}`;
        const postData = qs.stringify({
          type: type,
          account: account,
          ...data,
        });
        await axios.post(postUrl, postData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return {
    submitForm,
  };
}
