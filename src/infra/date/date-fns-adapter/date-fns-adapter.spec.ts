import dateFns from 'date-fns';
import { throwError } from '@/domain/test';
import { DateFnsAdapter } from '@/infra/date/date-fns-adapter/date-fns-adapter';

jest.mock('date-fns', () => ({
  add(): Date {
    return new Date(2020, 6, 20);
  },
}));


const makeSut = (): DateFnsAdapter => new DateFnsAdapter();

describe('DateFNS Adapter', () => {
  describe('add()', () => {
    test('Should call DateFNS with correct value', async () => {
      const sut = makeSut();
      const addSpy = jest.spyOn(dateFns, 'add');
      const currentDate = new Date();
      await sut.add(currentDate, {
        months: 2,
      });
      expect(addSpy).toHaveBeenCalledWith(currentDate, {
        months: 2,
      });
    });

    test('Should return a new Date on success', () => {
      const sut = makeSut();
      const resultDate = sut.add(new Date(), {
        months: 2,
      });
      expect(resultDate).toEqual(new Date(2020, 6, 20));
    });


    test('Should throw if add throws', () => {
      const sut = makeSut();
      jest.spyOn(dateFns, 'add').mockImplementationOnce(throwError);
      expect(() => {
        sut.add(new Date(), {
          months: 2,
        });
      }).toThrow();
    });
  });
});
