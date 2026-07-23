import { translatePromotion } from './src/shared/utils/dynamicTranslator.ts';
const i18n_en = { language: 'en' };
const i18n_vi = { language: 'vi' };
console.log('VI title:', translatePromotion('Đẳng cấp Diamond', i18n_vi));
console.log('EN title:', translatePromotion('Đẳng cấp Diamond', i18n_en));
console.log('VI tag:', translatePromotion('Đẳng cấp Diamond', i18n_vi));
console.log('VI desc:', translatePromotion('25% off tối đa đặc quyền Kim Cương', i18n_vi));
console.log('EN desc:', translatePromotion('25% off tối đa đặc quyền Kim Cương', i18n_en));
