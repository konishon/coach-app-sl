import {
  Button,
  HStack,
  useTheme,
  VStack,
  Text,
  Image,
  Center,
} from 'native-base';
import React from 'react';
import {Dimensions} from 'react-native';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import * as OnboardingImages from '../../../assets/images/onboarding';
import CarouselPaginate from '../../../components/Carousel/CarouselPaginate';
import Navigation from '../../../services/navigation';
import Routes from '../../../routes/paths';
import {isTablet as Tablet} from 'react-native-device-info';

const data = [
  {
    image: OnboardingImages['InformTeacherOnboarding'],
    title: 'Inform the teacher',
    subtitle:
      "Make sure to contact the teacher and let they know you're going to observe the class and have a mentoring session",
  },
  {
    image: OnboardingImages['BewareTimeOnboarding'],
    title: 'Beware of the time',
    subtitle:
      'Plan to spend 60 to 75 minutes with the teacher. Use this time to observe their class and to have the mentoring session',
  },
  {
    image: OnboardingImages['MakeNotesOnboarding'],
    title: 'Make notes',
    subtitle:
      'The notes will help you to answer the observation questions and plan the future mentoring sessions',
  },
];

const ClassOnboarding: React.FC<any> = () => {
  const {width: PAGE_WIDTH} = Dimensions.get('window');
  const progressValue = useSharedValue<number>(0);
  const pressAnim = useSharedValue<number>(0);
  const isTablet = Tablet();
  const theme = useTheme();

  return (
    <VStack flex={1} background={'primary.0'} safeAreaBottom>
      <VStack flex={1} mt={6}>
        <Carousel
          loop={false}
          onScrollBegin={() => {
            pressAnim.value = withTiming(1);
          }}
          onScrollEnd={() => {
            pressAnim.value = withTiming(0);
          }}
          data={data}
          width={PAGE_WIDTH * 1}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress;
          }}
          renderItem={({item, index}) => (
            <Center key={index} flex={1} justifyContent={'flex-start'}>
              <VStack
                alignItems={'center'}
                maxW={isTablet ? '500px' : 'inherit'}>
                <Image
                  alignSelf={'center'}
                  source={item.image}
                  alt={'Coach logo'}
                />

                <Text
                  fontSize={'HSM'}
                  fontWeight={600}
                  color={'gray.800'}
                  mb={'16px'}
                  textAlign={'center'}>
                  {item.title}
                </Text>
                <Text
                  fontSize={'TMD'}
                  fontWeight={400}
                  color={'gray.800'}
                  textAlign={'center'}>
                  {item.subtitle}
                </Text>
              </VStack>
            </Center>
          )}
        />
      </VStack>

      <HStack w={'100%'} justifyContent={'center'} py={2} space={2} mb={2}>
        {data.map((_, index) => (
          <CarouselPaginate
            backgroundColor={theme.colors.primary['200']}
            animValue={progressValue}
            index={index}
            key={index}
            isRotate={false}
            length={data.length}
          />
        ))}
      </HStack>

      <HStack px={isTablet ? '64px' : 4} space={'8px'} mb={6}>
        <Button
          flex={1}
          borderRadius={'8px'}
          borderWidth={0}
          variant={'outline'}
          color={'primary.200'}>
          Skip
        </Button>
        <Button
          flex={1}
          variant={'solid'}
          borderRadius={'8px'}
          color={'white'}
          background={'primary.200'}
          onPress={() => Navigation.navigate(Routes.classObservation.setup)}>
          Next
        </Button>
      </HStack>
    </VStack>
  );
};

export default ClassOnboarding;
