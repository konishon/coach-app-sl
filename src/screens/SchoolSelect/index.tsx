import React, {useCallback, useState} from 'react';
import {useCoachContext} from '../../providers/coach.provider';
import {SchoolService} from '../../services/school.service';
import {CoachService} from '../../services/coach.service';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent} from 'react-native-camera';
import {QrCodeImg} from '../../assets/images/scan';
import InputText from '../../components/InputText';
import {useNavigate} from 'react-router-native';
import useDebounce from '../../hooks/debounce';
import {useTranslation} from 'react-i18next';
import PathRoutes from '../../routers/paths';
import Header from '../../components/Header';
import {School} from '../../types/school';
import Icon from '../../components/Icon';
import Page from '../../components/Page';
import {Dimensions} from 'react-native';
import SchoolItem from './SchoolItem';
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Image,
  Modal,
  Spinner,
  Text,
  VStack,
} from 'native-base';

const SchoolSelectScreen: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [goToSync, setGoToSync] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [schoolList, setSchoolList] = useState<School[]>([]);

  const {t} = useTranslation();
  const navigate = useNavigate();
  const {height, width} = Dimensions.get('screen');
  const {selectSchool, selectCoach, currentSchool, currentCoach} =
    useCoachContext();

  const loadSchools = useCallback(async (value: string) => {
    setIsLoading(true);
    setSchoolList(await SchoolService.findSchoolItems(value));
    setIsLoading(false);
  }, []);

  useDebounce(filter, 300, loadSchools);

  const onSelectSchool = async (school: School) => {
    await selectSchool(school);

    if (currentCoach) {
      setShowProfileModal(true);
    } else {
      navigate(PathRoutes.selectAccount, {replace: true});
    }
  };

  const onRead = async (e: BarCodeReadEvent) => {
    const school: School = JSON.parse(e.data);

    await selectSchool(school);

    setIsOpen(false);

    if (currentCoach) {
      setShowProfileModal(true);
      setGoToSync(true);
    } else {
      navigate(PathRoutes.syncDetails, {replace: true});
    }
  };

  const goToCoachSelect = () => {
    selectCoach(null);

    if (goToSync) {
      navigate(PathRoutes.syncDetails, {replace: true});
    } else {
      navigate(PathRoutes.selectAccount, {replace: true});
    }
  };

  const createCoachSchool = async () => {
    setShowProfileModal(false);
    setIsLoading(true);

    if (currentCoach && currentSchool) {
      await CoachService.createCoachSchool(currentCoach, currentSchool);
    }

    if (goToSync) {
      navigate(PathRoutes.syncDetails, {replace: true});
    } else {
      navigate(PathRoutes.home.main, {replace: true});
    }
  };

  return (
    <Page setting logo back={!!currentSchool}>
      {isLoading ? (
        <Spinner />
      ) : schoolList.length > 0 ? (
        <>
          <Text
            fontSize={'HSM'}
            fontWeight={600}
            color={'gray.700'}
            mb={'16px'}>
            {t('schoolSelect.title')}
          </Text>

          <InputText
            mb={2}
            value={filter}
            placeholder={t('common.search')}
            onChangeText={setFilter}
          />

          <FlatList
            data={schoolList}
            keyExtractor={item => item.id || ''}
            renderItem={({item, index}) => (
              <SchoolItem
                index={index}
                school={item}
                onPress={() => onSelectSchool(item)}
              />
            )}
          />
        </>
      ) : (
        <VStack my="auto">
          <Image
            w="172px"
            h="172px"
            mt="45px"
            source={QrCodeImg}
            mx="auto"
            alt="scan image"
          />
          <Text
            mt="24px"
            textAlign="center"
            fontSize={20}
            color="#111417"
            fontWeight="600">
            {t('aboutScan.title')}
          </Text>
          <Text mt="4px" color="#576375" fontSize={16} textAlign="center">
            {t('aboutScan.description')}
          </Text>
        </VStack>
      )}

      <Button
        bg="#3373CC"
        mt="auto"
        _text={{fontWeight: 500, fontSize: 16}}
        onPress={() => setIsOpen(true)}>
        {t('aboutScan.scan')}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <VStack position="relative">
          <QRCodeScanner onRead={onRead} cameraStyle={{height}} />

          <Box
            w={width / 2}
            h={width / 2}
            right={width / 4}
            borderWidth="2px"
            position="absolute"
            borderColor="#fff"
            top={height / 2 - width / 4}></Box>
          <Box
            position="absolute"
            bg="rgba(0,0,0,0.4)"
            w={width}
            top={0}
            right={0}
            h={height / 2 - width / 4}></Box>
          <Box
            position="absolute"
            bg="rgba(0,0,0,0.4)"
            w={width}
            bottom={0}
            right={0}
            h={height / 2 - width / 4 - 48}></Box>
          <Box
            position="absolute"
            bg="rgba(0,0,0,0.4)"
            w={width / 4}
            top={height / 2 - width / 4}
            right={0}
            h={width / 2}></Box>
          <Box
            position="absolute"
            bg="rgba(0,0,0,0.4)"
            w={width / 4}
            top={height / 2 - width / 4}
            left={0}
            h={width / 2}></Box>

          <Box
            bg="rgba(0,0,0,0.4)"
            position="absolute"
            top={0}
            left={0}
            right={0}
            pt="20px">
            <Header back onBack={() => setIsOpen(false)} color="#fff" setting />
          </Box>
        </VStack>
      </Modal>
      <Modal isOpen={showProfileModal}>
        <VStack
          borderRadius="2xl"
          p="16px"
          maxW="320px"
          w="90%"
          mx="auto"
          my="auto"
          bg="#fff">
          <Text fontSize="20px" fontWeight="bold" mb="20px" color="#111417">
            {'Is that you?'}
          </Text>

          <Center
            mx="auto"
            mb="16px"
            w={'56px'}
            h={'56px'}
            borderRadius={'500px'}
            background={'primary.100'}>
            <Icon name={'user'} />
          </Center>

          <Text
            fontSize="16px"
            color="#111417"
            mx="auto">{`You were previously logged in as`}</Text>
          <Text
            fontWeight="bold"
            fontSize="16px"
            color="#111417"
            mx="auto"
            mb="16px">{`${currentCoach?.name} ${currentCoach?.surname}`}</Text>
          <Text
            mx="auto"
            fontSize="16px"
            color="#111417"
            mb="24px">{`Would you like to continue?`}</Text>
          <HStack ml="auto">
            <Button
              onPress={goToCoachSelect}
              bg="#ffffff"
              mr="8px"
              _text={{color: '#3373CC'}}>
              Switch profile
            </Button>
            <Button
              onPress={createCoachSchool}
              borderRadius={'8px'}
              bg="#3373CC">
              Continue
            </Button>
          </HStack>
        </VStack>
      </Modal>
    </Page>
  );
};

export default SchoolSelectScreen;
