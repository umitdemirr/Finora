﻿using Business.Constants;
using Core.Entities.Concrete;
using Entities.Concrete;
using FluentValidation;

namespace Business.ValidationRules.FluentValidation;

public class UserValidator : AbstractValidator<User>
{
    public UserValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().WithMessage(ValidatorMessages.UserNameNotEmpty);
        RuleFor(x => x.FirstName).MinimumLength(3).WithMessage(ValidatorMessages.UserNameMinimumLength);
        RuleFor(x => x.Mail).Must(EndsWithDomain).WithMessage(ValidatorMessages.UserMustEndsWithDomain);

    }
    private bool EndsWithDomain(string arg)
    {
        return arg.EndsWith("@dmo.gov.tr");
    }
}