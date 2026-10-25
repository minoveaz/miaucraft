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
    designYourTag: string;
    designYourTagSubtitle: string;
    step1Design: string;
    step1SingleDesign: string;
    step2Color: string;
    step3Name: string;
    namePlaceholder: string;
    nameRequiredHelp: string;
    step4Phone: string;
    phonePlaceholder: string;
    step5Font: string;
    fontHelp: string;
    yourDesign: string;
    chooseAColor: string;
    addAName: string;
    livePreviewBadge: string;
    myCustomTag: string;
    addToCart: string;
    addToCartShort: string;
    addedToCart: string;
    viewCart: string;
    stayOnProduct: string;
    customizable: string;
    engravedText: string;
    writeName: string;
    sizeGuide: string;
    sizeGuideHelp: string;
    tagSpecsTitle: string;
    reviews: string;
    customerReviews: string;
    decreaseQuantity: string;
    increaseQuantity: string;
    description: string;
    shippingReturns: string;
    sizingFit: string;
    materialsCare: string;
    relatedProducts: string;
    dragToRotate: string;
    surgicalSteelBadge: string;
    viewFront: string;
    viewBack: string;
    allShapes: string;
    collapseShapes: string;
    popularFonts: string;
    backPhoneHelp: string;
    specs: {
      material: string;
      materialVal: string;
      size: string;
      sizeVal: string;
      thickness: string;
      thicknessVal: string;
      engraving: string;
      engravingVal: string;
      text: string;
      textVal: string;
    };
    highlights: {
      deliveryTitle: string;
      deliveryDesc: string;
      returnsTitle: string;
      returnsDesc: string;
      shippingTitle: string;
      shippingDesc: string;
    };
    details: {
      descriptionContent: string;
      shippingContent: string;
      sizingContent: string;
      materialsContent: string;
    };
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
