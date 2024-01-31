import { beforeEach, describe, expect, it } from "bun:test";

import { createMock } from "@douglasneuroinformatics/nestjs/testing";
import { Test } from "@nestjs/testing";

import { DatasetsService } from "../datasets.service";

describe('DatasetsService', () => {
    let datasetsService: DatasetsService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: DatasetsService,
                    useValue: createMock(DatasetsService)
                }
            ]
        }).compile();
        datasetsService = moduleRef.get(DatasetsService);
    });

    it('should be defined', () => {
        expect(datasetsService).toBeDefined();
    });

    describe('create', () => {
        // TO_DO
        it('should create a new dataset', () => {
            // TO_DO
        });
    });

    describe('deleteById', () => {
        // TO_DO
        it('should find the dataset by id and then delete the dataset entirely', () => {
            // TO_DO
        });
    });

    describe('deleteColumn', () => {
        // TO_DO
        it('find the dataset by id and then find the column by name and delete all records in each dataEntry(row)', () => {
            // TO_DO
        });
    });

    describe('getAvailable', () => {
        // TO_DO
        it('return all available datasets metadata in the database accessible to the current users permission level', () => {
            // TO_DO
        });
    });

    describe('getById', () => {
        // TO_DO
        it('should find the dataset by id in the db and return the object if found and accessible to the current user', () => {
            // TO_DO
        });

        it('should return null if the dataset is not found', () => {
            // TO_DO
        });

        it('should not return dataset in the db if the user do not have the permission to see it', () => {
            // TO_DO
        });
    });

    describe('mutateTypes', () => {
        it('should find the dataset by id and then mutate the type of a column', () => {
            // TO_DO
        });

        it('should reject to mutate the type of a column if the validation fails', () {
            // TO_DO
        });
    });

    describe('updateColumn', () => {
        it('should find the dataset by id and update the corresponding column according to the update column dto', () => {
            // To_DO
        });
    });



});