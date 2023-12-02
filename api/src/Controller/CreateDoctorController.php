<?php

namespace App\Controller;

use App\Action\CreateUserAction;
use App\Entity\DoctorInfo;
use App\Entity\Room;
use App\Entity\Speciality;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\Json;

class CreateDoctorController extends AbstractController
{

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * @var UserPasswordHasherInterface
     */
    private UserPasswordHasherInterface $hasher;

    /**
     * @param EntityManagerInterface $entityManager
     * @param UserPasswordHasherInterface $hasher
     */
    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $hasher)
    {
        $this->entityManager = $entityManager;
        $this->hasher = $hasher;
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/create-doctor', name: 'app_create_doctor', methods: ['POST'])]
    public function index(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data["user"], $data["doctorInfo"])) {
            throw new BadRequestHttpException();
        }

        $userData = $data["user"];

        $user = new User();
        $user->setEmail($userData["email"])
            ->setPlainPassword($userData["plainPassword"])
            ->setPhone($userData["phone"])
            ->setFirstName($userData["firstName"])
            ->setLastName($userData["lastName"])
            ->setSex($userData["sex"])
            ->setBirthday($userData["birthday"])
            ->setAddress($userData["address"])
            ->setRegistration($userData["registration"])
            ->setPassport($userData["passport"]);

        $createUser = new CreateUserAction($this->hasher, $this->entityManager);
        $user = $createUser->hashUserPassword($user);
        $user->setRoles([User::ROLE_DOCTOR]);

        $this->entityManager->persist($user);

        $doctorData = $data["doctorInfo"];

        $room = $this->entityManager->getRepository(Room::class)->findOneBy(["id" => $doctorData["room"]]);

        if (!$room) {
            throw new UnprocessableEntityHttpException();
        }

        $speciality = $this->entityManager->getRepository(Speciality::class)->findOneBy(["id" => $doctorData["speciality"]]);

        if (!$speciality) {
            throw new UnprocessableEntityHttpException();
        }

        $doctorInfo = new DoctorInfo();
        $doctorInfo->setGrades([])
            ->setConsultationPrice(null)
            ->setVisitPrice(null)
            ->setOperationPrice(null)
            ->setDuration(null)
            ->setFormats([
                "online"  => false,
                "offline" => false
            ])
            ->setRoom($room)
            ->setSpeciality($speciality)
            ->setUser($user);

        $this->entityManager->persist($doctorInfo);
        $this->entityManager->flush();

        return new JsonResponse([
            "user"       => $user,
            "doctorInfo" => $doctorInfo
        ]);
    }

}


