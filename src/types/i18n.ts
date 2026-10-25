// Tipos para el sistema de internacionalización bilingüe

export type SupportedLocale = 'es' | 'en';
export type SupportedCurrency = 'USD' | 'EUR';

export interface LocaleConfig {
  locale: SupportedLocale;
  currency: SupportedCurrency;
  currencySymbol: string;
  name: string;
  flag: string;
}

export interface I18nDictionary {
  common: {
    freeShippingNotice: string;
    viewCart: string;
    checkout: string;
    addToCart: string;
    addingToCart: string;
    addedToCart: string;
    price: string;
    quantity: string;
    subtotal: string;
    shipping: string;
    total: string;
    emptyCart: string;
    continueShopping: string;
    backToHome: string;
    loading: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    required: string;
    optional: string;
    preview: string;
  };
  nav: {
    home: string;
    tags: string;
    catTags: string;
    dogTags: string;
    bandanas: string;
    collars: string;
    tagStudio: string;
    about: string;
    blog: string;
    faq: string;
    contact: string;
    account: string;
    cart: string;
    search: string;
    searchPlaceholder: string;
  };
  product: {
    personalize: string;
    selectDesign: string;
    selectFinish: string;
    selectFont: string;
    petName: string;
    petNamePlaceholder: string;
    phoneNumber: string;
    phoneNumberPlaceholder: string;
    frontEngraving: string;
    backEngraving: string;
    view2D: string;
    view3D: string;
    frontSide: string;
    backSide: string;
    tagSpecs: string;
    sizeGuide: string;
    materialsCare: string;
    shippingReturns: string;
    freeShippingThreshold: string;
    returnPolicy: string;
    customerReviews: string;
    relatedProducts: string;
  };
  customer: {
    accountTitle: string;
    myPets: string;
    orders: string;
    savedDesigns: string;
    addresses: string;
    logout: string;
    login: string;
    register: string;
    addPet: string;
    quickPersonalize: string;
  };
  footer: {
    tagline: string;
    shop: string;
    help: string;
    company: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
    newsletterPlaceholder: string;
    subscribe: string;
    allRightsReserved: string;
    privacy: string;
    terms: string;
  };
}
