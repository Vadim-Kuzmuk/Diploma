<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Action\CreateUserAction;
use App\Action\GetDoctorScheduleAction;
use App\Action\GetDoctorScheduleDaysAction;
use App\Action\GetUserVisitsAction;
use App\Action\GetUserVisitsHistoryAction;
use App\Action\GetDoctorFinishedVisitsAction;
use App\Action\GetDoctorPlannedVisitsAction;
use App\Action\GetDoctorReceptionTimesAction;
use App\Action\GetDoctorSchedule;
use App\Action\GetDoctorScheduleDays;
use App\Action\UpdateDoctorReceptionTimesAction;
use App\Repository\UserRepository;
use App\Validator\Constraints\UserBirthdayConstraint;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\GreaterThanOrEqual;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Regex;

#[
    ApiResource(
        collectionOperations: [
            "get"  => [
                "method"                => "GET",
                "normalization_context" => ['groups' => ["get:collection:user"]],
                "security"              => "is_granted('" . User::ROLE_ADMIN . "')"
            ],
            "post" => [
                "method"                  => "POST",
                "denormalization_context" => ['groups' => ["post:collection:user"]],
                "normalization_context"   => ['groups' => ["get:item:user"]],
                "security"                => "is_granted('PUBLIC_ACCESS')",
                "controller"              => CreateUserAction::class
            ]
        ],
        itemOperations: [
            "get"                    => [
                "method"                => "GET",
                "normalization_context" => ['groups' => ["get:item:user"]],
                "security"              => "is_granted('USER_INFO_ACCESS_CHECK', object)"
            ],
            "patch"                  => [
                "method"                  => "PATCH",
                "denormalization_context" => ['groups' => ["patch:item:user"]],
                "normalization_context"   => ['groups' => ["get:item:user"]],
                "security"                => "is_granted('IS_USER_OWNER_CHECK', object)",
                "controller"              => CreateUserAction::class
            ],
            "doctor-schedule"        => [
                "method"     => "GET",
                "path"       => "doctor-schedule/{id}/{day}",
                "controller" => GetDoctorScheduleAction::class,
            ],
            "doctor-schedule-days"   => [
                "method"     => "GET",
                "path"       => "doctor-schedule/{id}",
                "controller" => GetDoctorScheduleDaysAction::class,
            ],
            "doctor-planned-visits"  => [
                "method"     => "GET",
                "path"       => "doctor-planned-visits/{id}",
                "controller" => GetDoctorPlannedVisitsAction::class,
                "security"   => "is_granted('VISIT_DOCTOR_ACCESS_CHECK', object) or is_granted('" . User::ROLE_ADMIN . "')"
            ],
            "doctor-finished-visits" => [
                "method"     => "GET",
                "path"       => "doctor-finished-visits/{id}",
                "controller" => GetDoctorFinishedVisitsAction::class,
                "security"   => "is_granted('VISIT_DOCTOR_ACCESS_CHECK', object) or is_granted('" . User::ROLE_ADMIN . "')"
            ],
            "doctor-reception-times" => [
                "method"     => "GET",
                "path"       => "doctor-reception-times/{id}",
                "controller" => GetDoctorReceptionTimesAction::class,
                "security"   => "is_granted('VISIT_DOCTOR_ACCESS_CHECK', object) or is_granted('" . User::ROLE_ADMIN . "')"
            ],
            "visits-history"         => [
                "method"     => "GET",
                "path"       => "users/{id}/history",
                "security"   => "is_granted('IS_USER_OWNER_CHECK', object)",
                "controller" => GetUserVisitsHistoryAction::class,
            ],
            "visits"                 => [
                "method"     => "GET",
                "path"       => "users/{id}/visits",
                "security"   => "is_granted('IS_USER_OWNER_CHECK', object)",
                "controller" => GetUserVisitsAction::class,
            ]
        ]
    )]
#[ApiFilter(SearchFilter::class, properties: [
    "email" => "exact"
])]
#[UserBirthdayConstraint]
#[UniqueEntity(
    fields: ['email'],
    message: "already-registered"
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface, JsonSerializable
{

    public const ROLE_CLIENT             = "ROLE_CLIENT";
    public const ROLE_FREELANCER         = "ROLE_FREELANCER";
    public const ROLE_FREELANCER_PENDING = "ROLE_FREELANCER_PENDING";
    public const ROLE_STAFF              = "ROLE_STAFF";
    public const ROLE_DOCTOR             = "ROLE_DOCTOR";
    public const ROLE_ADMIN              = "ROLE_ADMIN";

    /**
     * @var Uuid|null
     */
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups([
        "get:collection:user",
        "get:item:user",
        "patch:item:doctor-info",
        "get:item:doctor-info",
        "get:collection:doctor-info",
        "get:item:speciality",
        "get:collection:client-info"
    ])]
    private ?Uuid $id = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[Email(
        message: "invalid email."
    )]
    #[Groups([
        "get:collection:user",
        "get:item:user",
        "post:collection:user",
        "put:item:user",
        "patch:item:user",
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "patch:item:doctor-info",
        "get:collection:client-info"
    ])]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    /**
     * @var array
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string|null
     */
    #[Regex(
        pattern: '/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/',
        message: "invalid-password"
    )]
    #[Groups([
        "post:collection:user",
        "put:item:user",
        "patch:item:user",

    ])]
    private ?string $plainPassword = null;

    /**
     * @var string|null The hashed password
     */
    #[ORM\Column(nullable: true)]
    private ?string $password = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[Regex(
        pattern: '/^\+38\(0(?!0{2})[0-9]{2}\)-[0-9]{3}-[0-9]{2}-[0-9]{2}$/',
        message: "invalid-phone"
    )]
    #[Groups([
        "get:collection:user",
        "get:item:user",
        "post:collection:user",
        "put:item:user",
        "patch:item:user",
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "get:item:speciality",
        "patch:item:doctor-info",
        "get:collection:client-info"
    ])]
    #[ORM\Column(length: 20)]
    private ?string $phone = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[Groups([
        "get:collection:user",
        "get:item:user",
        "post:collection:user",
        "put:item:user",
        "patch:item:user",
        "get:collection:doctor-info",
        "get:item:visit",
        "get:collection:visit",
        "get:item:doctor-info",
        "get:item:speciality",
        "patch:item:doctor-info",
        "get:collection:client-info"
    ])]
    #[ORM\Column(length: 45)]
    private ?string $firstName = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[Groups([
        "get:collection:user",
        "get:item:user",
        "post:collection:user",
        "put:item:user",
        "patch:item:user",
        "get:collection:doctor-info",
        "get:item:visit",
        "get:collection:visit",
        "get:item:doctor-info",
        "get:item:speciality",
        "patch:item:doctor-info",
        "get:collection:client-info"
    ])]
    #[ORM\Column(length: 45)]
    private ?string $lastName = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[Groups([
        "get:collection:user",
        "get:item:user",
        "post:collection:user",
        "put:item:user",
        "patch:item:user",
        "get:item:doctor-info",
        "get:collection:client-info"
    ])]
    #[Regex(
        pattern: '/^(m|f)$/',
        message: "invalid-sex"
    )]
    #[ORM\Column(length: 45)]
    private ?string $sex = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[Groups([
        "get:collection:user",
        "get:item:user",
        "post:collection:user",
        "put:item:user",
        "patch:item:user",
        "get:collection:client-info"
    ])]
    #[GreaterThanOrEqual(-2208988800)]
    #[ORM\Column(type: Types::BIGINT)]
    private ?string $birthday = null;

    /**
     * @var array|null
     */
    #[NotNull]
    #[NotBlank]
    #[Groups([
        "get:collection:user",
        "get:item:user",
        "post:collection:user",
        "put:item:user",
        "patch:item:user",
        "get:collection:client-info"
    ])]
    #[ORM\Column(type: Types::JSON)]
    private ?array $address = null;

    /**
     * @var array|null
     */
    #[NotNull]
    #[NotBlank]
    #[Groups([
        "get:collection:user",
        "get:item:user",
        "post:collection:user",
        "put:item:user",
        "patch:item:user",
        "get:collection:client-info"
    ])]
    #[ORM\Column(type: Types::JSON)]
    private ?array $registration = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[Regex(
        pattern: '/^((\d{9})|([A-Za-z]{2}\d{6}))$/',
        message: "invalid-passport"
    )]
    #[Groups([
        "get:collection:user",
        "get:item:user",
        "post:collection:user",
        "put:item:user",
        "patch:item:user",
        "get:collection:client-info"
    ])]
    #[ORM\Column(length: 255)]
    private ?string $passport = null;

    /**
     * @var string|null
     */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $pic = null;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: "client", targetEntity: Operation::class)]
    private Collection $clientOperations;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: "doctor", targetEntity: Operation::class)]
    private Collection $doctorOperations;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: "staff", targetEntity: StaffOperation::class)]
    private Collection $staffOperations;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Visit::class)]
    private Collection $clientVisits;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'doctor', targetEntity: Visit::class)]
    private Collection $doctorVisits;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: HistoryAccess::class)]
    private Collection $ownerHistoryAccesses;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'allowed', targetEntity: HistoryAccess::class)]
    private Collection $allowedHistoryAccesses;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'doctor', targetEntity: ReceptionTime::class)]
    #[Groups([
        "get:item:doctor-info"
    ])]
    private Collection $receptionTimes;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Invite::class)]
    private Collection $invites;

    /**
     * @var ClientInfo|null
     */
    #[ORM\OneToOne(mappedBy: 'user')]
    private ?ClientInfo $clientInfo = null;

    /**
     * @var DoctorInfo|null
     */
    #[Groups([
        "get:item:user"
    ])]
    #[ORM\OneToOne(mappedBy: 'user')]
    private ?DoctorInfo $doctorInfo = null;

    /**
     * @var FreelancerInfo|null
     */
    #[ORM\OneToOne(mappedBy: 'user')]
    private ?FreelancerInfo $freelancerInfo = null;

    /**
     * @var StaffInfo|null
     */
    #[ORM\OneToOne(mappedBy: 'user')]
    private ?StaffInfo $staffInfo = null;

    /**
     * @var FreelanceRequest|null
     */
    #[ORM\OneToOne(mappedBy: 'freelancer')]
    private ?FreelanceRequest $freelanceRequest = null;

    /** User constructor */
    public function __construct()
    {
        $this->doctorOperations = new ArrayCollection();
        $this->clientOperations = new ArrayCollection();
        $this->staffOperations = new ArrayCollection();

        $this->clientVisits = new ArrayCollection();
        $this->doctorVisits = new ArrayCollection();

        $this->ownerHistoryAccesses = new ArrayCollection();
        $this->allowedHistoryAccesses = new ArrayCollection();

        $this->receptionTimes = new ArrayCollection();

        $this->invites = new ArrayCollection();
    }

    /**
     * @return Uuid|null
     */
    public function getId(): ?Uuid
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     * @return $this
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }

    /**
     * @deprecated since Symfony 5.3, use getUserIdentifier instead
     */
    public function getUsername(): string
    {
        return (string)$this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        return $this->roles;
    }

    /**
     * @param array $roles
     * @return $this
     */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @param string $password
     * @return $this
     */
    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    /**
     * @param string|null $plainPassword
     * @return User
     */
    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getPhone(): ?string
    {
        return $this->phone;
    }

    /**
     * @param string|null $phone
     * @return $this
     */
    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    /**
     * @param string|null $firstName
     * @return $this
     */
    public function setFirstName(?string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    /**
     * @param string|null $lastName
     * @return $this
     */
    public function setLastName(?string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getSex(): ?string
    {
        return $this->sex;
    }

    /**
     * @param string|null $sex
     * @return $this
     */
    public function setSex(?string $sex): self
    {
        $this->sex = $sex;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getBirthday(): ?string
    {
        return $this->birthday;
    }

    /**
     * @param string|null $birthday
     * @return $this
     */
    public function setBirthday(?string $birthday): self
    {
        $this->birthday = $birthday;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getAddress(): ?array
    {
        return $this->address;
    }

    /**
     * @param array|null $address
     * @return $this
     */
    public function setAddress(?array $address): self
    {
        $this->address = $address;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getRegistration(): ?array
    {
        return $this->registration;
    }

    /**
     * @param array|null $registration
     * @return $this
     */
    public function setRegistration(?array $registration): self
    {
        $this->registration = $registration;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getPassport(): ?string
    {
        return $this->passport;
    }

    /**
     * @param string|null $passport
     * @return $this
     */
    public function setPassport(?string $passport): self
    {
        $this->passport = $passport;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getPic(): ?string
    {
        return $this->pic;
    }

    /**
     * @param string|null $pic
     * @return $this
     */
    public function setPic(?string $pic): self
    {
        $this->pic = $pic;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getClientOperations(): Collection
    {
        return $this->clientOperations;
    }

    /**
     * @param Collection $clientOperations
     * @return $this
     */
    public function setClientOperations(Collection $clientOperations): self
    {
        $this->clientOperations = $clientOperations;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getDoctorOperations(): Collection
    {
        return $this->doctorOperations;
    }

    /**
     * @param Collection $doctorOperations
     * @return $this
     */
    public function setDoctorOperations(Collection $doctorOperations): self
    {
        $this->doctorOperations = $doctorOperations;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getStaffOperations(): Collection
    {
        return $this->staffOperations;
    }

    /**
     * @param Collection $staffOperations
     * @return $this
     */
    public function setStaffOperations(Collection $staffOperations): self
    {
        $this->staffOperations = $staffOperations;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getClientVisits(): Collection
    {
        return $this->clientVisits;
    }

    /**
     * @param Collection $clientVisits
     * @return $this
     */
    public function setClientVisits(Collection $clientVisits): self
    {
        $this->clientVisits = $clientVisits;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getDoctorVisits(): Collection
    {
        return $this->doctorVisits;
    }

    /**
     * @param Collection $doctorVisits
     * @return $this
     */
    public function setDoctorVisits(Collection $doctorVisits): self
    {
        $this->doctorVisits = $doctorVisits;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getOwnerHistoryAccesses(): Collection
    {
        return $this->ownerHistoryAccesses;
    }

    /**
     * @param Collection $ownerHistoryAccesses
     * @return $this
     */
    public function setOwnerHistoryAccesses(Collection $ownerHistoryAccesses): self
    {
        $this->ownerHistoryAccesses = $ownerHistoryAccesses;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getAllowedHistoryAccesses(): Collection
    {
        return $this->allowedHistoryAccesses;
    }

    /**
     * @param Collection $allowedHistoryAccesses
     * @return $this
     */
    public function setAllowedHistoryAccesses(Collection $allowedHistoryAccesses): self
    {
        $this->allowedHistoryAccesses = $allowedHistoryAccesses;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getReceptionTimes(): Collection
    {
        return $this->receptionTimes;
    }

    /**
     * @param Collection $receptionTimes
     * @return $this
     */
    public function setReceptionTimes(Collection $receptionTimes): self
    {
        $this->receptionTimes = $receptionTimes;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getInvites(): Collection
    {
        return $this->invites;
    }

    /**
     * @param Collection $invites
     * @return $this
     */
    public function setInvites(Collection $invites): self
    {
        $this->invites = $invites;

        return $this;
    }

    /**
     * @return ClientInfo|null
     */
    public function getClientInfo(): ?ClientInfo
    {
        return $this->clientInfo;
    }

    /**
     * @param ClientInfo $clientInfo
     * @return $this
     */
    public function setClientInfo(ClientInfo $clientInfo): self
    {
        if ($clientInfo->getUser() !== $this) {
            $clientInfo->setUser($this);
        }

        $this->clientInfo = $clientInfo;

        return $this;
    }

    /**
     * @return DoctorInfo|null
     */
    public function getDoctorInfo(): ?DoctorInfo
    {
        return $this->doctorInfo;
    }

    /**
     * @param DoctorInfo $doctorInfo
     * @return $this
     */
    public function setDoctorInfo(DoctorInfo $doctorInfo): self
    {
        if ($doctorInfo->getUser() !== $this) {
            $doctorInfo->setUser($this);
        }

        $this->doctorInfo = $doctorInfo;

        return $this;
    }

    /**
     * @return FreelancerInfo|null
     */
    public function getFreelancerInfo(): ?FreelancerInfo
    {
        return $this->freelancerInfo;
    }

    /**
     * @param FreelancerInfo $freelancerInfo
     * @return $this
     */
    public function setFreelancerInfo(FreelancerInfo $freelancerInfo): self
    {
        if ($freelancerInfo->getUser() !== $this) {
            $freelancerInfo->setUser($this);
        }

        $this->freelancerInfo = $freelancerInfo;

        return $this;
    }

    /**
     * @return FreelanceRequest|null
     */
    public function getFreelanceRequest(): ?FreelanceRequest
    {
        return $this->freelanceRequest;
    }

    /**
     * @param FreelanceRequest $freelanceRequest
     * @return $this
     */
    public function setFreelanceRequest(FreelanceRequest $freelanceRequest): self
    {
        if ($freelanceRequest->getFreelancer() !== $this) {
            $freelanceRequest->setFreelancer($this);
        }

        $this->freelanceRequest = $freelanceRequest;

        return $this;
    }

    /**
     * @return StaffInfo|null
     */
    public function getStaffInfo(): ?StaffInfo
    {
        return $this->staffInfo;
    }

    /**
     * @param StaffInfo $staffInfo
     * @return $this
     */
    public function setStaffInfo(StaffInfo $staffInfo): self
    {
        if ($staffInfo->getUser() !== $this) {
            $staffInfo->setUser($this);
        }

        $this->staffInfo = $staffInfo;

        return $this;
    }

    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            "id"           => $this->getId()->toRfc4122(),
            "email"        => $this->getEmail(),
            "phone"        => $this->getPhone(),
            "firstName"    => $this->getFirstName(),
            "lastName"     => $this->getLastName(),
            "sex"          => $this->getSex(),
            "birthday"     => $this->getBirthday(),
            "address"      => $this->getAddress(),
            "registration" => $this->getRegistration(),
            "passport"     => $this->getPassport()
        ];
    }

}