describe('AuthService', () => {
  let authService: AuthService;
  let usersService: MockedInstance<UsersService>;
  let cryptoService: MockedInstance<CryptoService>;
  let jwtService: MockedInstance<JwtService>;

  // called before every test to intialize the AuthService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (propertyPath: string) => propertyPath
          }
        },
        {
          provide: CryptoService,
          useValue: createMock(CryptoService)
        },
        {
          provide: I18nService,
          useValue: createMock(I18nService)
        },
        { provide: JwtService, useValue: createMock(JwtService) },
        {
          provide: MailService,
          useValue: createMock(MailService)
        },
        {
          provide: UsersService,
          useValue: createMock(UsersService)
        }
      ]
    }).compile();
    // get all the services we need from the moduleRef
    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    cryptoService = moduleRef.get(CryptoService);
    jwtService = moduleRef.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  let createAccountDto: CreateAccountDto;
  let createUserDto: CreateUserDto;

  beforeEach(() => {
    createAccountDto = createAccountDtoStubFactory();
    createUserDto = createUserDtoStubFactory();
  });

  describe('createAccount', () => {
    it('calls the usersService.createUser and returns the created account', async () => {
      usersService.createUser.mockResolvedValue({
        ...createAccountDto,
        isVerified: false,
        role: 'standard'
      });

      const result = await authService.createAccount(createAccountDto);
      expect(result).toMatchObject({
        ...createAccountDto,
        isVerified: false,
        role: 'standard'
      });
    });
  });
  });
