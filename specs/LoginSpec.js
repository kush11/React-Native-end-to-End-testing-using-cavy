export default function (spec) {
  spec.describe('Click On LOgin Button', () => {
    spec.it('CLicks to Login to a better life', async () => {
      await spec.press('Action.PreOnBoardButton');
      await spec.press('Action.LoginButton');
      await spec.fillIn('Username.TextInput', 'K');
      await spec.fillIn('Passcode.TextInput', '0000');
      await spec.press('Action.LoginButton1');
      await spec.pause(1000);
      await spec.press('Action.clickOnChecks'); // Action.SelectAssessment
      await spec.pause(1000);
      await spec.press('Action.SelectAssessment');
      await spec.pause(10000);
    });
  });

  // spec.describe('Click On Login User Button', () => {
  //   spec.it('Click On Login User Button', async () => {
  //     await spec.press('Action.LoginButton1');
  //     await spec.pause(10000);
  //   });
  // });
}
