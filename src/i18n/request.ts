import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const common = (await import(`./common/pt.json`)).default;
  const dashboard = (await import(`./dashboard/pt.json`)).default;
  const beneficiary = (await import(`./beneficiary/pt.json`)).default;
  const delivery = (await import(`./delivery/pt.json`)).default;

  return {
    locale: 'pt',
    messages: {
      Common: common,
      Dashboard: dashboard,
      Beneficiary: beneficiary,
      Delivery: delivery,
    },
  };
});
