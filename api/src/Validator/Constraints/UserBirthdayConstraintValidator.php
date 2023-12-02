<?php

namespace App\Validator\Constraints;

use App\Entity\User;
use Symfony\Component\HttpFoundation\File\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class UserBirthdayConstraintValidator extends ConstraintValidator
{

    /**
     * @param $value
     * @param Constraint $constraint
     * @return void
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof UserBirthdayConstraint) {
            throw new UnexpectedTypeException($constraint, UserBirthdayConstraint::class);
        }

        if (!$value instanceof User) {
            throw new UnexpectedTypeException($value, User::class);
        }

        if ($value->getBirthday() >= time()) {
            $this->context->addViolation("Date of birth can't be equal to or greater than the current date");
        }
    }

}