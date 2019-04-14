export const handleError = (error: any, req: any, res: any, next: any) => {
    return res.apiError(error);
};
