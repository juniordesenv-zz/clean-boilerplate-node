import faker from 'faker';

export const mockNodemailer = (jest) => {
  jest.mock('nodemailer', () => ({
    createTransport() {
      return {
        sendMail: jest.fn(() => ({
          messageId: faker.random.uuid(),
        })),
      };
    },
  }));
};
