// هذا الكود يستبدل المنطق الحالي بآخر آمن
export const useGetMenuMaster = () => {
  // القيمة الافتراضية التي تحمي التطبيق من الانهيار
  return {
    menuMaster: {
      isDashboardDrawerOpened: true, // القائمة مفتوحة دائماً
      isComponentDrawerOpened: true
    }
  };
};

export const handlerDrawerOpen = (status) => {
  console.log("تم استدعاء تحديث القائمة: ", status);
  // نتركها فارغة حالياً لمنع الخطأ
};