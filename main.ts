import { translate, TranslationType } from './lib';

translate('animal', TranslationType.ENGTUR).then((resp: any) => {
  // tslint:disable-next-line:no-console
  console.log(resp);
});
