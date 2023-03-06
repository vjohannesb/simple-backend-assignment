import { VehicleBrand } from '@/types/brands';
import { DocumentClient } from '@/utils/DocumentClient';

export class BrandsRepo {
  private table = process.env.VEHICLE_BRANDS_TABLE;
  private static db: DocumentClient = new DocumentClient();

  async getBrands(): Promise<VehicleBrand[]> {
    const params = {
      TableName: this.table,
    };

    try {
      const result = await BrandsRepo.db.scan(params);
      return result?.Items as VehicleBrand[];
    } catch (ex) {
      console.error('Error at BrandsRepo.getBrands: ', ex?.message);
    }
  }

  async getBrand(brand: string): Promise<VehicleBrand> {
    const params = {
      TableName: this.table,
      Key: { brand },
    };

    try {
      const result = await BrandsRepo.db.get(params);
      return result?.Item as VehicleBrand;
    } catch (ex) {
      console.error('Error at BrandsRepo.getBrand: ', ex?.message);
    }
  }

  async incrementBrandCount(brand: string): Promise<VehicleBrand> {
    const params = {
      TableName: this.table,
      Key: { brand },
      UpdateExpression: 'ADD #count :val',
      expressionAttributeNames: { '#count': 'count' },
      ExpressionAttributeValues: { ':val': 1 },
      ReturnValues: 'ALL_NEW',
    };

    try {
      const result = await BrandsRepo.db.update(params);
      return result?.Attributes as VehicleBrand;
    } catch (ex) {
      console.error('Error at BrandsRepo.incrementBrandCounter: ', ex?.message);
    }
  }
}
