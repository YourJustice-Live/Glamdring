import axios from 'axios';
import qs from 'qs';

/**
 * Hook for work with formsubmit.io.
 */
export default function useFormSubmit() {
  /**
   * Post feedback to formsubmit.io.
   *
   * @param {string} account Account address.
   * @param {string} feedback Feedback message.
   * @param {string} contact Feedback contact.
   */
  let submitFeedback = async function (account, feedback, contact) {
    try {
      const url = 'https://formsubmit.co/ajax/dev@yourjustice.life';
      const data = qs.stringify({
        form: 'submit_feedback',
        account: account,
        feedback: feedback,
        contact: contact,
      });
      await axios.post(url, data);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    submitFeedback,
  };
}
