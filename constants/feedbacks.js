import { EMAIL } from 'constants/contacts';

export const FORM = {
  // Post Feedback
  postFeedback: {
    type: 'post_feedback',
    recepients: [EMAIL.dev, EMAIL.product],
    title: 'Post Feedback',
    description:
      'Do you have ideas how to improve the app? Maybe you have questions? Post feedback.',
    schema: {
      type: 'object',
      required: ['feedback'],
      properties: {
        feedback: {
          type: 'string',
          title: 'Your Feedback',
        },
        contact: {
          type: 'string',
          title: 'Your Email, Twitter, Telegram, etc',
        },
      },
    },
    uiSchema: {
      feedback: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 5,
        },
      },
    },
  },
  // Ask Question
  askQuestion: {
    type: 'ask_question',
    recepients: [EMAIL.dev, EMAIL.product],
    title: 'Ask Question',
    description: 'What question do you have?',
    schema: {
      type: 'object',
      required: ['question'],
      properties: {
        question: {
          type: 'string',
          title: 'Your Question',
        },
        contact: {
          type: 'string',
          title: 'Your Email, Twitter, Telegram, etc',
        },
      },
    },
    uiSchema: {
      question: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 5,
        },
      },
    },
  },
  // Propose Law
  proposeLaw: {
    type: 'propose_law',
    recepients: [EMAIL.dev, EMAIL.law],
    title: 'Propose Law',
    description:
      'What law is missing in the jurisdiction? Describe it so we can add it.',
    schema: {
      type: 'object',
      required: ['proposition'],
      properties: {
        proposition: {
          type: 'string',
          title: 'Your Proposition',
        },
        contact: {
          type: 'string',
          title: 'Your Email, Twitter, Telegram, etc',
        },
      },
    },
    uiSchema: {
      proposition: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 5,
        },
      },
    },
  },
  // Comment Law
  commentLaw: {
    type: 'comment_law',
    recepients: [EMAIL.dev, EMAIL.law],
    title: 'Add Comment',
    description: 'How can we improve this law? What is wrong with it?',
    schema: {
      type: 'object',
      required: ['comment'],
      properties: {
        comment: {
          type: 'string',
          title: 'Your Comment',
        },
        contact: {
          type: 'string',
          title: 'Your Email, Twitter, Telegram, etc',
        },
      },
    },
    uiSchema: {
      comment: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 5,
        },
      },
    },
  },
};
