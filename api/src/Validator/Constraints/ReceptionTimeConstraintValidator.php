<?php

namespace App\Validator\Constraints;

use App\Entity\ReceptionTime;
use App\Entity\User;
use DateTime;
use Symfony\Component\HttpFoundation\File\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class ReceptionTimeConstraintValidator extends ConstraintValidator
{

    /**
     * @param $value
     * @param Constraint $constraint
     * @return void
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof ReceptionTimeConstraint) {
            throw new UnexpectedTypeException($constraint, ReceptionTimeConstraint::class);
        }

        if (!$value instanceof ReceptionTime) {
            throw new UnexpectedTypeException($value, ReceptionTime::class);
        }

        $temp = new DateTime();
        $startDay = $temp->setTimestamp($value->getStart())->format('j');
        $endDay = $temp->setTimestamp($value->getEnd())->format('j');

        if ($startDay !== $endDay) {
            $this->context->addViolation("ReceptionTime timestamps shouldn't be in different days");
        }

        if ($value->getStart() >= $value->getEnd()) {
            $this->context->addViolation("ReceptionTime start time can not be greater than end time");
        }
    }

}