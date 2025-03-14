export enum KycStatus {
NONE = -2, // Нет статуса, в процессе заполнения
PREMODERATION = -1, // Премодерация
READY_FOR_SEND = 0, // Готов к отправке на модерацию
WAIT_AUDIT = 1, // Ждет проверки
IN_AUDIT = 2, // В процессе
ADOPT_PASS = 3, // Прошли
REFUSE = 4, // Мусо
}