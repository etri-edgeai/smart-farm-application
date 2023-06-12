import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';


App.addListener('resume', async () => {
  alert('resume');
    await Browser.open({ url: 'https://connect.farmcloud.kr/app' });
});

App.addListener('backButton', async (data) => {
  alert('back');
  await App.exitApp();
});


alert('init');
