export const keepNonNegativeNumber = (str: string) => {
  return str
    .replace(/[^\d.]/g, "") // Удаляем всё кроме цифр и точки
    .replace(/(\..*)\./g, "$1") // Оставляем только первую точку
    .replace(/^0+(?=\d)/g, "") // Убираем ведущие нули (кроме "0" и "0.xxx")
    .replace(/^$/, ""); // Если пусто — возвращаем "0"
};
