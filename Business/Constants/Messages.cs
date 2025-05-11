namespace Business.Constants;

public static class Messages
{
    #region General Messages
    public const string ActionSuccessful = "İşlem başarılı.";
    public const string ActionFailed = "İşlem başarısız.";
    internal static string? AuthorizationsDenied = "Yetkiniz yok!";
    public const string UserNotFound = "Kullanıcı bulunamadı!";
    public const string LdapError = "Personel bulunamadı!";
    public const string PasswordError = "Hatalı Parola";
    public const string SuccessfulLogin = "Giriş Başarılı";
    internal static string AccessTokenCreated = "Erişim jetonu oluşturuldu.";

    #endregion

    #region User Messages
    public const  string UserAdded = "Kullanıcı başarıyla eklendi!";
    public const string UserDeleted = "Kullanıcı başarıyla silindi!";
    public const string UserUpdated = "Kullanıcı başarıyla güncellendi!";
    public const string UserNameInvalid = "Kullanıcı adı en az 2 karakter olmalıdır.";
    public const string UsersList = "Kullanıcılar listelendi.";
    public const string UserDetailsList = "Kullanıcı detayları listelendi.";
    internal static string UserMailAlreadyExists = "Bu kullanıcı maili sistemde zaten kayıtlı!";
    internal static string UserRegistrationIdAlreadyExists = "Bu kullanıcı sicil numarası sistemde zaten kayıtlı!";
    internal static string UserAlreadyExists = "Bu kullaıcı zaten var!";
    #endregion

    #region CreditCard Messages
    public const string CreditCardAdded = "Kullanıcı başarıyla eklendi!";
    public const string CreditCardDeleted = "Kullanıcı başarıyla silindi!";
    public const string CreditCardUpdated = "Kullanıcı başarıyla güncellendi!";
    public const string CreditCardInvalid = "Kullanıcı adı en az 2 karakter olmalıdır.";
    public const string CreditCardList = "Kullanıcılar listelendi.";
    public const string CreditCardDetailList = "Kullanıcı detayları listelendi.";
    #endregion

    #region Transaction Messages
    public const string TransactionAdded = "İşlem başarıyla kaydedildi.";
    public const string TransactionUpdated = "İşlem bilgileri güncellendi.";
    public const string TransactionDeleted = "İşlem silindi.";
    public const string TransactionNotFound = "İşlem bulunamadı.";

    public const string TransactionAmountInvalid = "İşlem tutarı geçersiz.";
    public const string TransactionAmountRequired = "İşlem tutarı girilmelidir.";
    public const string TransactionDirectionRequired = "İşlem yönü (Gelen/Giden) belirtilmelidir.";

    public const string TransactionFailed = "İşlem gerçekleştirilemedi. Lütfen tekrar deneyin.";
    public const string TransactionDateInvalid = "İşlem tarihi geçersiz.";

    public const string InsufficientBalance = "İşlem tutarı hesap bakiyesinden büyük olamaz.";
    public const string AccountNotSelected = "İşlem yapılacak hesap seçilmelidir.";
    public const string TransactionTypeUnknown = "Bilinmeyen işlem türü.";

    public const string TransactionAlreadyExists = "Bu işlem zaten kayıtlı.";
    public const string TransactionAmountExceedsLimit = "İşlem tutarı kalan limiti aşıyor.";
    #endregion
}
